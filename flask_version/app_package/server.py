from flask import Blueprint, render_template, make_response, jsonify
from app_package import db
from sqlalchemy.sql import text
import sqlite3

import json
import csv

server = Blueprint('server', __name__)
    
@server.route('/')
def index():
    try:
        db.session.query('1').from_statement(text('SELECT 1')).all()
        print("can connect to db", flush=True)
    except Exception as e:
        # e holds description of the error
        error_text = "<p>The error:<br>" + str(e) + "</p>"
        print(error_text, flush=True)
    return render_template('index.html')

@server.route('/get_nodes', methods=['GET'])
def nodes():
    try:
        nodes = json.load(open('C:/Users/anita/Documents/D3JS_Titanic/flask_version/app_package/nodes.json', 'r'))
        nodes_table = nodes
    except FileNotFoundError:
        print("file not found", flush=True)
    return jsonify(nodes)

@server.route('/get_instances', methods=['GET'])
def instances():
    try:
        csv_reader = csv.reader(open('C:/Users/anita/Documents/D3JS_Titanic/flask_version/app_package/titanic_test_results.csv', 'r'))
        csv_data = []
        for row in csv_reader:
    #         instances_columns = ['id', 'survived', 'sex', 'age', 'number of siblings and spouses', 
    # 'number of parents and children', 'fare', 'class', 'deck', 'port of embarkation', 
    # 'alone', 'confidence', 'predicted', 'is prediction correct']
            row_object = {
                'id': row[0],
                'survived': row[1],
                'sex': row[2],
                'age': row[3],
                'n_siblings_spouses': row[4],
                'parch': row[5],
                'fare': row[6],
                'class': row[7],
                'deck': row[8],
                'embark_town': row[9],
                'alone': row[10], 
                'confidence': row[11],
                'predicted': row[12], 
                'is_prediction_correct': row[13]
            }
            csv_data.append(row_object)
        instances_table = csv_data[1:]
    except FileNotFoundError:
        print("file not found", flush=True)
    return jsonify(csv_data[1:])

@server.route('/get_tsne', methods=['GET'])
def tsne():
    try:
        tsne = json.load(open('C:/Users/anita/Documents/D3JS_Titanic/flask_version/app_package/data.json', 'r'))
        tsne_data = tsne
    except FileNotFoundError:
        print("file not found", flush=True)
    return jsonify(tsne)