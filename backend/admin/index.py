'''
Business: Admin panel for managing platform settings and owner account
Args: event - dict with httpMethod, body, queryStringParameters  
      context - object with attributes: request_id, function_name
Returns: HTTP response dict with settings data
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
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
        cursor.execute("SELECT * FROM platform_settings ORDER BY key")
        settings = cursor.fetchall()
        
        result = {}
        for setting in settings:
            if 'created_at' in setting and setting['created_at']:
                setting['created_at'] = setting['created_at'].isoformat()
            if 'updated_at' in setting and setting['updated_at']:
                setting['updated_at'] = setting['updated_at'].isoformat()
            result[setting['key']] = setting
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'settings': result})
        }
    
    if method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        key = body_data.get('key')
        value = body_data.get('value')
        
        if not key or value is None:
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Key and value required'})
            }
        
        try:
            cursor.execute(
                """UPDATE platform_settings 
                   SET value = %s, updated_at = CURRENT_TIMESTAMP 
                   WHERE key = %s
                   RETURNING *""",
                (str(value), key)
            )
            updated = cursor.fetchone()
            
            if not updated:
                cursor.execute(
                    """INSERT INTO platform_settings (key, value, description)
                       VALUES (%s, %s, %s) RETURNING *""",
                    (key, str(value), body_data.get('description', ''))
                )
                updated = cursor.fetchone()
            
            conn.commit()
            
            if 'created_at' in updated and updated['created_at']:
                updated['created_at'] = updated['created_at'].isoformat()
            if 'updated_at' in updated and updated['updated_at']:
                updated['updated_at'] = updated['updated_at'].isoformat()
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps(dict(updated))
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
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'get_commission_report':
            cursor.execute(
                """SELECT 
                       SUM(CASE WHEN recipient_type = 'platform' THEN amount ELSE 0 END) as platform_total,
                       SUM(CASE WHEN recipient_type = 'author' THEN amount ELSE 0 END) as authors_total,
                       COUNT(DISTINCT transaction_id) as total_transactions
                   FROM commission_splits
                   WHERE status = %s""",
                ('completed',)
            )
            report = cursor.fetchone()
            
            cursor.execute(
                "SELECT value FROM platform_settings WHERE key = %s",
                ('platform_owner_account',)
            )
            owner_account = cursor.fetchone()
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'platform_earnings': float(report['platform_total'] or 0),
                    'authors_earnings': float(report['authors_total'] or 0),
                    'total_transactions': report['total_transactions'],
                    'owner_account': owner_account['value'] if owner_account else ''
                })
            }
    
    cursor.close()
    conn.close()
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
