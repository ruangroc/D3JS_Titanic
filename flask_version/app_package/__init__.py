
import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import sqlite3

# create and configure the app
app = Flask(__name__, instance_relative_config=True)

# setup source: https://python-adv-web-apps.readthedocs.io/en/latest/flask_db1.html
db_name = 'titanic.db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_name
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
# this variable, db, will be used for all SQLAlchemy commands
db = SQLAlchemy(app)

from . import server
app.register_blueprint(server.server)
