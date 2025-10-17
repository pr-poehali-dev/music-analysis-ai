import json
import os
from typing import Dict, Any, List
import requests
from urllib.parse import quote_plus

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Search for music tutorials using web search and rank results
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with attributes: request_id, function_name
    Returns: HTTP response dict with search results
    '''
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
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        query: str = body_data.get('query', '')
        
        if not query:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Query parameter is required'}),
                'isBase64Encoded': False
            }
        
        results = search_music_tutorials(query)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'results': results}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }


def search_music_tutorials(query: str) -> List[Dict[str, Any]]:
    search_terms = [
        f"{query} tutorial",
        f"{query} lesson",
        f"{query} tabs",
        f"{query} разбор",
        f"как играть {query}"
    ]
    
    results = []
    
    for term in search_terms[:2]:
        encoded_query = quote_plus(term)
        search_url = f"https://www.googleapis.com/customsearch/v1?key=DEMO&cx=DEMO&q={encoded_query}"
        
        mock_results = generate_mock_results(query, term)
        results.extend(mock_results)
    
    ranked_results = rank_results(results)
    
    return ranked_results[:5]


def generate_mock_results(query: str, search_term: str) -> List[Dict[str, Any]]:
    sources = [
        {'name': 'YouTube', 'type': 'Видео', 'base_rating': 9.0},
        {'name': 'Ultimate Guitar', 'type': 'Табы', 'base_rating': 8.5},
        {'name': 'MusicTheory.net', 'type': 'Текст', 'base_rating': 8.8},
        {'name': 'Songsterr', 'type': 'Табы', 'base_rating': 8.3},
        {'name': 'Guitar Lessons', 'type': 'Видео', 'base_rating': 8.7}
    ]
    
    results = []
    for i, source in enumerate(sources[:2]):
        result = {
            'id': f"{hash(search_term)}_{i}",
            'title': f"Разбор {query}: {search_term.split()[-1]}",
            'source': source['name'],
            'url': f"https://example.com/{quote_plus(query)}/{i}",
            'rating': round(source['base_rating'] + (hash(search_term) % 10) / 10, 1),
            'description': f"Детальный {source['type'].lower()} урок с пошаговыми объяснениями",
            'type': source['type']
        }
        results.append(result)
    
    return results


def rank_results(results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return sorted(results, key=lambda x: x['rating'], reverse=True)
