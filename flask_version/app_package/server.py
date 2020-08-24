from flask import Blueprint, render_template, make_response, jsonify, request
from app_package import db
from sqlalchemy.sql import text
import sqlite3

import json
import csv

server = Blueprint('server', __name__)
    
@server.route('/')
def index():
    # try:
    #     db.session.query('1').from_statement(text('SELECT 1')).all()
    #     print("can connect to db", flush=True)
    # except Exception as e:
    #     # e holds description of the error
    #     error_text = "<p>The error:<br>" + str(e) + "</p>"
    #     print(error_text, flush=True)
    return render_template('index.html')

@server.route('/get_nodes', methods=['GET'])
def nodes():
    try:
        # connect to db
        conn = sqlite3.connect('titanic.db')
        c = conn.cursor()

        # make sure to create a fresh table
        c.execute("drop table if exists nodes;")
        create_query = """CREATE TABLE "nodes" (
                            "conditions"	TEXT,
                            "id"	        INTEGER NOT NULL UNIQUE,
                            "num_samples"	INTEGER,
                            "num_correct"	INTEGER,
                            "ratio_correct"	NUMERIC,
                            PRIMARY KEY("id" AUTOINCREMENT)
                        );"""
        c.execute(create_query)

        # open the nodes.json file and load the data into the database
        nodes = json.load(open('C:/Users/anita/Documents/D3JS_Titanic/flask_version/app_package/nodes.json', 'r'))
        for node in nodes:
            # print(node, flush=True)
            # print("node['conditions']", node['conditions'], flush=True)
            conditions_str = ', '.join(node['conditions'])
            c.execute("insert into nodes (conditions, num_samples, num_correct, ratio_correct) values (?, ?, ?, ?);", 
                        [conditions_str, node['num_samples'], node['num_correct'], node['ratio_correct']])
            conn.commit()
        conn.close()
    except FileNotFoundError:
        print("file not found", flush=True)
    return jsonify(nodes)

@server.route('/get_instances', methods=['GET'])
def instances():
    try:
        # connect to db
        conn = sqlite3.connect('titanic.db')
        c = conn.cursor()

        # make sure to create a fresh table
        c.execute("drop table if exists instances;")
        create_query = """CREATE TABLE "instances" (
                            "id"	                INTEGER NOT NULL UNIQUE,
                            "survived"	            INTEGER,
                            "sex"	                TEXT,
                            "age"	                NUMERIC,
                            "n_siblings_spouses"    INTEGER,
                            "parch"                 INTEGER,
                            "fare"                  NUMERIC,
                            "class"                 TEXT,
                            "deck"                  TEXT,
                            "embark_town"           TEXT,
                            "alone"                 TEXT,
                            "confidence"            NUMERIC,
                            "predicted"             INTEGER,
                            "is_prediction_correct" TEXT,
                            PRIMARY KEY("id" AUTOINCREMENT)
                        );"""
        c.execute(create_query)

        # open the titanic_test_results csv and make sure the data is able to be sent back as json
        # and is also entered into the database
        csv_reader = csv.reader(open('C:/Users/anita/Documents/D3JS_Titanic/flask_version/app_package/titanic_test_results.csv', 'r'))
        csv_data = []
        for row in csv_reader:
            # print(row, flush=True)
            if row[0] != 'id':
                row_object = {
                    'id': int(row[0]),
                    'survived': int(row[1]),
                    'sex': row[2],
                    'age': float(row[3]),
                    'n_siblings_spouses': int(row[4]),
                    'parch': int(row[5]),
                    'fare': float(row[6]),
                    'class': row[7],
                    'deck': row[8],
                    'embark_town': row[9],
                    'alone': row[10], 
                    'confidence': float(row[11]),
                    'predicted': int(row[12]), 
                    'is_prediction_correct': row[13]
                }
                csv_data.append(row_object)
                # enter each item into db here
                c.execute("insert into instances values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", 
                            [int(row[0]), int(row[1]), row[2], float(row[3]), int(row[4]), 
                            int(row[5]), float(row[6]), row[7], row[8], row[9], row[10], float(row[11]), 
                            int(row[12]), row[13]])
                conn.commit()
        conn.close()
    except FileNotFoundError:
        print("file not found", flush=True)
    return jsonify(csv_data)

@server.route('/get_tsne', methods=['GET'])
def tsne():
    try:
        # connect to db
        conn = sqlite3.connect('titanic.db')
        c = conn.cursor()

        # make sure to create a fresh table
        c.execute("drop table if exists tsne;")
        create_query = """CREATE TABLE "tsne" (
                            "id"	INTEGER NOT NULL UNIQUE,
                            "x"	    NUMERIC,
                            "y"     NUMERIC,
                            PRIMARY KEY("id" AUTOINCREMENT)
                        );"""
        c.execute(create_query)

        # open the data.json file and load the tsne data into the database
        tsne = json.load(open('C:/Users/anita/Documents/D3JS_Titanic/flask_version/app_package/data.json', 'r'))
        for i in tsne:
            c.execute("insert into tsne (x, y) values (?, ?);", [float(tsne[i]['tsne1']), float(tsne[i]['tsne2'])])
            conn.commit()
        conn.close()
    except FileNotFoundError:
        print("file not found", flush=True)
    return jsonify(tsne)

@server.route('/filter_view', methods=['POST'])
def filter_view():
    node_info = request.get_json(force=True)

    # need to fix the conditions
    # there's no sex > 0.5, only 'male' or 'female', and similar
    conditions = node_info['conditions']
    num_conditions = len(node_info['conditions'])
    for i, condition in enumerate(conditions):
        if "sex <= 0.5" in condition:
            conditions[i] = " sex = 'female'"
        elif "sex > 0.5" in condition:
            conditions[i] = " sex = 'male'"
        elif "deck <= 0.5" in condition:
            conditions[i] = " deck = 'A'"
        elif "deck > 0.5" in condition:
            conditions[i] = " deck != 'A'"
        elif "deck <= 2.5" in condition:
            conditions[i] = " (deck = 'A' OR deck = 'B' OR deck = 'C')"
        elif "deck <= 3.5" in condition:
            conditions[i] = " (deck = 'A' OR deck = 'B' OR deck = 'C' OR deck = 'D')"
        elif "deck <= 5.0" in condition:
            conditions[i] = " deck != 'unknown'"
        elif "class <= 1.5" in condition:
            conditions[i] = " (class = 'First' OR class = 'Second')"
        elif "class > 1.5" in condition:
            conditions[i] = "' class = 'Third'"

    # construct the query
    query = "SELECT * from instances JOIN tsne on instances.id = tsne.id WHERE"
    i = 0
    for condition in conditions:
        i += 1
        query += condition
        if i != num_conditions:
            query += " AND"
        if i == num_conditions:
            query += ";"

    # connect to the db and execute the query
    conn = sqlite3.connect('titanic.db')
    c = conn.cursor()
    c.execute(query)
    fetched_instances = c.fetchall()
    conn.close()
    return make_response(jsonify(fetched_instances), 200)