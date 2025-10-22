'''
Business: Create and process payments with 20% platform commission
Args: event - dict with httpMethod, body, queryStringParameters
      context - object with attributes: request_id, function_name
Returns: HTTP response dict with payment data
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
    conn.autocommit = False
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        user_id = body_data.get('user_id')
        work_id = body_data.get('work_id')
        amount = body_data.get('amount')
        payment_method = body_data.get('payment_method', 'balance')
        
        if not all([user_id, work_id, amount]):
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Missing required fields'})
            }
        
        try:
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            
            cursor.execute("SELECT id, author_id, price FROM works WHERE id = %s", (work_id,))
            work = cursor.fetchone()
            if not work:
                conn.rollback()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Work not found'})
                }
            
            cursor.execute(
                "SELECT id FROM wallets WHERE user_id = %s AND currency = %s",
                (user_id, 'RUB')
            )
            wallet = cursor.fetchone()
            if not wallet:
                cursor.execute(
                    "INSERT INTO wallets (user_id, balance, currency) VALUES (%s, %s, %s) RETURNING id",
                    (user_id, 0, 'RUB')
                )
                wallet = {'id': cursor.fetchone()['id']}
            
            cursor.execute(
                """INSERT INTO transactions 
                   (user_id, wallet_id, type, amount, currency, status, payment_method, description)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
                (user_id, wallet['id'], 'purchase', amount, 'RUB', 'completed', payment_method, f'Purchase work #{work_id}')
            )
            transaction_id = cursor.fetchone()['id']
            
            cursor.execute(
                "SELECT value FROM platform_settings WHERE key = %s",
                ('platform_commission_percentage',)
            )
            platform_commission = float(cursor.fetchone()['value']) / 100
            author_commission = 1 - platform_commission
            
            platform_amount = float(amount) * platform_commission
            author_amount = float(amount) * author_commission
            
            cursor.execute(
                """INSERT INTO commission_splits 
                   (transaction_id, recipient_type, recipient_id, amount, percentage, status)
                   VALUES (%s, %s, %s, %s, %s, %s)""",
                (transaction_id, 'platform', None, platform_amount, platform_commission * 100, 'completed')
            )
            
            cursor.execute(
                """INSERT INTO commission_splits 
                   (transaction_id, recipient_type, recipient_id, amount, percentage, status)
                   VALUES (%s, %s, %s, %s, %s, %s)""",
                (transaction_id, 'author', work['author_id'], author_amount, author_commission * 100, 'completed')
            )
            
            cursor.execute(
                "UPDATE wallets SET balance = balance + %s WHERE user_id = %s AND currency = %s",
                (author_amount, work['author_id'], 'RUB')
            )
            
            cursor.execute(
                """INSERT INTO purchases (user_id, work_id, transaction_id, price)
                   VALUES (%s, %s, %s, %s) RETURNING id""",
                (user_id, work_id, transaction_id, amount)
            )
            purchase_id = cursor.fetchone()['id']
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'transaction_id': transaction_id,
                    'purchase_id': purchase_id,
                    'author_amount': author_amount,
                    'platform_amount': platform_amount,
                    'status': 'success'
                })
            }
            
        except Exception as e:
            conn.rollback()
            conn.close()
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)})
            }
    
    if method == 'GET':
        params = event.get('queryStringParameters', {})
        user_id = params.get('user_id')
        
        if not user_id:
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'user_id required'})
            }
        
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(
            """SELECT t.*, w.balance 
               FROM transactions t
               LEFT JOIN wallets w ON t.wallet_id = w.id
               WHERE t.user_id = %s
               ORDER BY t.created_at DESC
               LIMIT 50""",
            (user_id,)
        )
        transactions = cursor.fetchall()
        
        for txn in transactions:
            if 'created_at' in txn and txn['created_at']:
                txn['created_at'] = txn['created_at'].isoformat()
            if 'updated_at' in txn and txn['updated_at']:
                txn['updated_at'] = txn['updated_at'].isoformat()
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'transactions': transactions})
        }
    
    conn.close()
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
