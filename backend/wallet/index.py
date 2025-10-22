'''
Business: Manage user wallets, balances, and withdrawals
Args: event - dict with httpMethod, body, queryStringParameters
      context - object with attributes: request_id, function_name
Returns: HTTP response dict with wallet data
'''

import json
import os
from typing import Dict, Any
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if method == 'GET':
        params = event.get('queryStringParameters', {})
        user_id = params.get('user_id')
        
        if not user_id:
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'user_id required'})
            }
        
        cursor.execute(
            """SELECT w.*, 
                      COALESCE(SUM(CASE WHEN cs.recipient_type = 'author' THEN cs.amount ELSE 0 END), 0) as total_earned,
                      COUNT(DISTINCT p.id) as total_purchases
               FROM wallets w
               LEFT JOIN transactions t ON t.wallet_id = w.id
               LEFT JOIN commission_splits cs ON cs.transaction_id = t.id AND cs.recipient_id = %s
               LEFT JOIN purchases p ON p.user_id = %s
               WHERE w.user_id = %s AND w.currency = %s
               GROUP BY w.id""",
            (user_id, user_id, user_id, 'RUB')
        )
        wallet = cursor.fetchone()
        
        if not wallet:
            cursor.execute(
                "INSERT INTO wallets (user_id, balance, currency) VALUES (%s, %s, %s) RETURNING *",
                (user_id, 0, 'RUB')
            )
            conn.commit()
            wallet = cursor.fetchone()
        
        if 'created_at' in wallet and wallet['created_at']:
            wallet['created_at'] = wallet['created_at'].isoformat()
        if 'updated_at' in wallet and wallet['updated_at']:
            wallet['updated_at'] = wallet['updated_at'].isoformat()
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps(dict(wallet))
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'withdraw':
            user_id = body_data.get('user_id')
            amount = body_data.get('amount')
            payment_method = body_data.get('payment_method')
            payment_details = body_data.get('payment_details', {})
            
            if not all([user_id, amount, payment_method]):
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'})
                }
            
            try:
                conn.autocommit = False
                
                cursor.execute(
                    "SELECT value FROM platform_settings WHERE key = %s",
                    ('min_withdrawal_amount',)
                )
                min_amount = float(cursor.fetchone()['value'])
                
                if float(amount) < min_amount:
                    conn.close()
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': f'Minimum withdrawal is {min_amount} RUB'})
                    }
                
                cursor.execute(
                    "SELECT id, balance FROM wallets WHERE user_id = %s AND currency = %s FOR UPDATE",
                    (user_id, 'RUB')
                )
                wallet = cursor.fetchone()
                
                if not wallet or float(wallet['balance']) < float(amount):
                    conn.rollback()
                    conn.close()
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Insufficient funds'})
                    }
                
                cursor.execute(
                    """INSERT INTO withdrawals 
                       (user_id, wallet_id, amount, status, payment_method, payment_details)
                       VALUES (%s, %s, %s, %s, %s, %s) RETURNING id""",
                    (user_id, wallet['id'], amount, 'pending', payment_method, json.dumps(payment_details))
                )
                withdrawal_id = cursor.fetchone()['id']
                
                cursor.execute(
                    "UPDATE wallets SET balance = balance - %s WHERE id = %s",
                    (amount, wallet['id'])
                )
                
                cursor.execute(
                    """INSERT INTO transactions 
                       (user_id, wallet_id, type, amount, currency, status, payment_method, description)
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
                    (user_id, wallet['id'], 'withdrawal', -float(amount), 'RUB', 'pending', payment_method, f'Withdrawal #{withdrawal_id}')
                )
                
                conn.commit()
                cursor.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'withdrawal_id': withdrawal_id,
                        'status': 'pending',
                        'message': 'Withdrawal request created'
                    })
                }
                
            except Exception as e:
                conn.rollback()
                cursor.close()
                conn.close()
                return {
                    'statusCode': 500,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': str(e)})
                }
    
    cursor.close()
    conn.close()
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
