#!/usr/bin/env python3
# api.py
# Veronica Child, Liv Phillips, Adam Tigar
# 28 April 2016
# A program to return JSON format data on majors at Carleton
#

import sys
import flask
import json
import config
import psycopg2

app = flask.Flask(__name__, static_folder='static', template_folder='templates')

def _fetch_all_rows_for_query(query):
    """
    Returns a list of rows obtained from the Carlmajors database
    by the specified SQL query.  If the query fails for any reason,
    an empty list is returned.
    """
    try:
        connection = psycopg2.connect(database=config.database, user=config.user, password=config.password)
    except Exception as e:
        print('Conneciton error:', e, file=sys.stderr)
        return []

    rows = []
    try:
        cursor = connection.cursor()
        cursor.execute(query)
        rows = cursor.fetchall()
    except Exception as e:
        print('Error querying database:', e, file=sys.stderr)
        pass

    connection.close()
    return rows

@app.route('/')
def get_main_page():
    # Only intended route for users
    return flask.render_template('index.html')


@app.route('/api/v1.0/majors/')
def get_majors():
    """
    Returns all majors. Majors will be
    represented as a JSON dictionary with the key 'major_id' (int),
    'major_name'(str), and 'url' (string). The value associated
    with 'url' is a URL to retrieve the same major name in the future.
    """

    query = '''SELECT *
               FROM majors'''

    major_list = []
    for row in _fetch_all_rows_for_query(query):
        url = flask.url_for('get_major_by_id', major_id=row[1], _external=True)
        major = {'major_id': row[1], 'major_name': row[0], 'url': url}
        major_list.append(major)

    return json.dumps(major_list)


@app.route('api/v1.0/majors/<major_name>')
def get_major_by_name(major_name):
    """
    Returns the ID associated with the major name. ID will be
    represented as a single JSON dictionary with the key 'major_id' (int)
    and 'url' (string). The value associated with 'url' is a URL to
    retrieve the same major name in the future.
    """
    query = '''SELECT major_name, major_id
               FROM majors
               WHERE major_name= '{0}' '''.format(major_name)

    rows = _fetch_all_rows_for_query(query)
    if len(rows) > 0:
        row = rows[0]
        url = flask.url_for('get_major_by_id', major_id=row[1], _external=True)
        major = {'major_id': row[1], 'major_name': row[0], 'url': url}

    return json.dumps([major])


@app.route('api/v1.0/majors/<int:major_id>')
def get_major_by_id(major_id):
    """
    Returns the major name associated with an ID. Major name
    resource will be represented as a JSON dictionary with keys
    'major_name' (string), 'major_id' (int), and 'url' (string).
    The value associated with 'url' is a URL to retrieve the list
    in the future.
    """
    query = '''SELECT major_name, major_id
               FROM majors
               WHERE major_id= {0} '''.format(major_id)

    rows = _fetch_all_rows_for_query(query)
    if len(rows) > 0:
        row = rows[0]
        url = flask.url_for('get_major_by_id', major_id=row[1], _external=True)
        major_code = {'major_id': row[1], 'major_name': row[0], 'url': url}

    return json.dumps([major_code])


@app.route('/api/v1.0/years')
def get_years():
    """
    Returns all the data for all majors and years. Data
    resource will be represented as a JSON dictionary with keys
    'major_name' (string), 'major_id' (int), female_count (int),
    male_count (int), year (int), and 'url' (string).
    The value associated with 'url' is a URL to retrieve the list
    in the future.
    """
    query = '''SELECT majors.major_name, majors.major_id,
               majors_years.major_id, majors_years.year,
               majors_years.male_count, majors_years.female_count
               FROM majors, majors_years
               WHERE majors.major_id = majors_years.major_id'''

    year_major_list = []
    for row in _fetch_all_rows_for_query(query):
        url = flask.url_for('get_years_for_major', major_id=row[1], _external=True)
        year_major = {'year': row[3], 'major_name': row[0], 'major_id': row[1],
                      'male_count': row[4], 'female_count': row[5], 'url': url}
        year_major_list.append(year_major)

    return json.dumps(year_major_list)


@app.route('/api/v1.0/years/<int:major_id>')
def get_years_for_major(major_id):
    """
    Returns all the year data for a major. Data
    resource will be represented as a JSON dictionary with keys
    'major_name' (string), 'major_id' (int), female_count (int),
    male_count (int), year (int), and 'url' (string).
    The value associated with 'url' is a URL to retrieve the list
    in the future.    """
    query = '''SELECT majors.major_name, majors.major_id,
               majors_years.major_id, majors_years.year,
               majors_years.male_count, majors_years.female_count
               FROM majors, majors_years
               WHERE majors.major_id = {0}
               AND majors.major_id = majors_years.major_id'''.format(major_id)

    major_all_years = []
    for row in _fetch_all_rows_for_query(query):
        url = flask.url_for('get_years_for_major', major_id=row[1], _external=True)
        year_in_major = {'year': row[3], 'major_id': row[1], 'major_name': row[0],
                         'male_count': row[4], 'female_count': row[5], 'url': url}
        major_all_years.append(year_in_major)

    return json.dumps(major_all_years)


@app.route('/api/v1.0/year/<int:year>')
def get_majors_for_year(year):
    """
    Returns all the major data for a year. Data
    resource will be represented as a JSON dictionary with keys
    'major_name' (string), 'major_id' (int), female_count (int),
    male_count (int), year (int), and 'url' (string).
    The value associated with 'url' is a URL to retrieve the list
    in the future.
    """

    query = '''SELECT majors.major_name, majors.major_id,
               majors_years.major_id, majors_years.year,
               majors_years.male_count, majors_years.female_count
               FROM majors, majors_years
               WHERE year = {0}
               AND majors.major_id = majors_years.major_id'''.format(year)
    year_all_majors = []

    for row in _fetch_all_rows_for_query(query):
        url = flask.url_for('get_years_for_major', major_id=row[1], _external=True)
        major_in_year = {'year': row[3], 'major_id': row[1], 'major_name': row[0],
                         'male_count': row[4], 'female_count': row[5], 'url': url}
        year_all_majors.append(major_in_year)

    return json.dumps(year_all_majors)


if __name__ == "__main__":
    # With Liv's port, username phillipsl - starts the server
    app.run(host='thacker.mathcs.carleton.edu', port=5133)
