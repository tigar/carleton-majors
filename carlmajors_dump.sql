--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: majors; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE majors (
    major_name      TEXT,
    major_id        INTEGER NOT NULL
);


--
-- Name: majors_years; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE majors_years (
    year            INTEGER NOT NULL,
    major_id        INTEGER NOT NULL,
    male_count      INTEGER,
    female_count    INTEGER
);


--
-- Data for Name: majors; Type: TABLE DATA; Schema: public; Owner: -
--

\COPY majors (major_name, major_id) FROM 'majors.csv' DELIMITER ',' CSV HEADER


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: -
--

\COPY majors_years (year, major_id, male_count, female_count) FROM 'majors_years.csv' DELIMITER ',' CSV HEADER


--
-- Name: majors_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY majors
    ADD CONSTRAINT majors_pkey PRIMARY KEY (major_id);


--
-- PostgreSQL database dump complete
--

