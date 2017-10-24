# api_test.py
# Veronica Child, Liv Phillips, and Adam Tigar
# 25 April, 2016
# A tester program for our API, carlmajors.
# carlmajors API has two types of calls:
# 1) Input a major and get the yearly gender data
# 2) Input a year and get the gender data for ALL majors
# The format for the return is JSON, which is parsed by
# Python3 as a list of dictionaries.

import unittest
import urllib.request
import json


class CarlMajorsTester(unittest.TestCase):
    def setUp(self):
        self.url = "http://thacker.mathcs.carleton.edu:5133/{0}/{1}"

    def tearDown(self):
        pass

    # Connects to API given url
    def connect(self, url):
        try:
            data_from_server = urllib.request.urlopen(url).read()
            string_from_server = data_from_server.decode('utf-8')
            major_data = json.loads(string_from_server)
            return major_data

        except Exception as e:
            # Problems with network access of JSON parsing
            print("Cannot access JSON server for CarlMajors for " + url)
            return []

    # Tests length of majors list
    def test_majors_length(self):
        new_url = self.url.format('majors', '')
        majors_data = self.connect(new_url)
        m = len(majors_data)

        self.assertTrue(m == 48,
                        "API /majors/ list return is of \
                        incorrect length %i."
                        % m)

    def test_majors_valid(self):
        new_url = self.url.format('majors', '')
        majors_data = self.connect(new_url)

        for major_dict in majors_data:
            self.assertIsNotNone(major_dict['major_name'])
            self.assertIsNotNone(major_dict['major_id'])
            self.assertIsNotNone(major_dict['url'])

            self.assertIsInstance(major_dict['major_id'], int)
            self.assertIsInstance(major_dict['major_name'], str)
            self.assertIsInstance(major_dict['url'], str)

            self.assertTrue(len(major_dict) == 3)

    def test_majors_str_length(self):
        new_url = self.url.format('majors', 'English')
        majors_data = self.connect(new_url)
        m = len(majors_data)

        self.assertTrue(m == 1,
                        "API /majors/English list return is of \
                        incorrect length %i."
                        % m)

    def test_majors_str_valid(self):
        new_url = self.url.format('majors', 'English')
        majors_data = self.connect(new_url)

        for major_dict in majors_data:
            self.assertIsNotNone(major_dict['major_name'])
            self.assertIsNotNone(major_dict['major_id'])
            self.assertIsNotNone(major_dict['url'])

            self.assertIsInstance(major_dict['major_id'], int)
            self.assertIsInstance(major_dict['major_name'], str)
            self.assertIsInstance(major_dict['url'], str)

            self.assertTrue(len(major_dict) == 3)

    def test_majors_int_length(self):
        new_url = self.url.format('majors', '1')
        majors_data = self.connect(new_url)
        m = len(majors_data)

        self.assertTrue(m == 1,
                        "API /majors/1 list return is of \
                        incorrect length %i."
                        % m)

    def test_majors_int_valid(self):
        new_url = self.url.format('majors', '1')
        majors_data = self.connect(new_url)

        for major_dict in majors_data:
            self.assertIsNotNone(major_dict['major_name'])
            self.assertIsNotNone(major_dict['major_id'])
            self.assertIsNotNone(major_dict['url'])

            self.assertIsInstance(major_dict['major_id'], int)
            self.assertIsInstance(major_dict['major_name'], str)
            self.assertIsInstance(major_dict['url'], str)

            self.assertTrue(len(major_dict) == 3)

    def test_years_length(self):
        new_url = self.url.format('years', '')
        majors_data = self.connect(new_url)
        m = len(majors_data)

        self.assertTrue(m == 720,
                        "API /years/ list return is of \
                         incorrect length %i."
                        % m)

    def test_years_valid(self):
        new_url = self.url.format('years', '')
        years_data = self.connect(new_url)

        for major_dict in years_data:
            self.assertIsNotNone(major_dict['major_name'])
            self.assertIsNotNone(major_dict['major_id'])
            self.assertIsNotNone(major_dict['year'])
            self.assertIsNotNone(major_dict['female_count'])
            self.assertIsNotNone(major_dict['male_count'])
            self.assertIsNotNone(major_dict['url'])

            self.assertIsInstance(major_dict['major_id'], int)
            self.assertIsInstance(major_dict['major_name'], str)
            self.assertIsInstance(major_dict['year'], int)
            self.assertIsInstance(major_dict['female_count'], int)
            self.assertIsInstance(major_dict['male_count'], int)
            self.assertIsInstance(major_dict['url'], str)

            self.assertTrue(len(major_dict) == 6)

    def test_years_specific_length(self):
        new_url = self.url.format('years', '1')
        majors_data = self.connect(new_url)
        m = len(majors_data)

        self.assertTrue(m == 15,
                        "API /years/1 list return is of \
                        incorrect length %i."
                        % m)

    def test_years_specific_valid(self):
        new_url = self.url.format('years', '1')
        years_data = self.connect(new_url)

        for major_dict in years_data:
            self.assertIsNotNone(major_dict['major_name'])
            self.assertIsNotNone(major_dict['major_id'])
            self.assertIsNotNone(major_dict['year'])
            self.assertIsNotNone(major_dict['female_count'])
            self.assertIsNotNone(major_dict['male_count'])
            self.assertIsNotNone(major_dict['url'])

            self.assertIsInstance(major_dict['major_id'], int)
            self.assertIsInstance(major_dict['major_name'], str)
            self.assertIsInstance(major_dict['year'], int)
            self.assertIsInstance(major_dict['female_count'], int)
            self.assertIsInstance(major_dict['male_count'], int)
            self.assertIsInstance(major_dict['url'], str)

            self.assertTrue(len(major_dict) == 6)

    def test_year_specific_length(self):
        new_url = self.url.format('year', '2001')
        majors_data = self.connect(new_url)
        m = len(majors_data)

        self.assertTrue(m == 48,
                        "API /year/2001 list return is \
                        of incorrect length %i."
                        % m)

    def test_year_specific_valid(self):
        new_url = self.url.format('year', '2001')
        years_data = self.connect(new_url)

        for major_dict in years_data:
            self.assertIsNotNone(major_dict['major_name'])
            self.assertIsNotNone(major_dict['major_id'])
            self.assertIsNotNone(major_dict['year'])
            self.assertIsNotNone(major_dict['female_count'])
            self.assertIsNotNone(major_dict['male_count'])
            self.assertIsNotNone(major_dict['url'])

            self.assertIsInstance(major_dict['major_id'], int)
            self.assertIsInstance(major_dict['major_name'], str)
            self.assertIsInstance(major_dict['year'], int)
            self.assertIsInstance(major_dict['female_count'], int)
            self.assertIsInstance(major_dict['male_count'], int)
            self.assertIsInstance(major_dict['url'], str)

            self.assertTrue(len(major_dict) == 6)

    def test_get_major_name(self):
        new_url = self.url.format('majors', 1)
        list_major = self.connect(new_url)

        # Check that it exists
        for major_dict in list_major:
            self.assertIsNotNone(major_dict['major_name'])
            self.assertIsNotNone(major_dict['major_id'])
            self.assertIsInstance(major_dict['major_id'], int)
            self.assertIsInstance(major_dict['major_name'], str)
            self.assertTrue(len(major_dict) == 3)

    def test_get_major_id(self):
        new_url = self.url.format('majors', 'Chinese')
        list_major = self.connect(new_url)

        # Check that it exists
        for major_dict in list_major:
            self.assertIsNotNone(major_dict['major_name'])
            self.assertIsNotNone(major_dict['major_id'])
            self.assertIsInstance(major_dict['major_name'], str)
            self.assertIsInstance(major_dict['major_id'], int)
            self.assertTrue(len(major_dict) == 3)

    # Check that our ids and and major names align
    def test_get_major_by_id(self):
        new_url = self.url.format('majors', 1)
        major_name = self.connect(new_url)
        for major_dict in major_name:
            self.assertEqual(
                major_dict.get("major_name"),
                'African and African American Studies')

    def test_get_major_by_name(self):
        new_url = self.url.format('majors',
                                  'Chinese')
        major_id = self.connect(new_url)
        for major_dict in major_id:
            self.assertEqual(
                major_dict.get("major_id"),
                9)


if __name__ == '__main__':
    unittest.main()
