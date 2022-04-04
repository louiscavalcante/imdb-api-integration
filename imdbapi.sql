--
-- PostgreSQL database dump
--

-- Dumped from database version 13.6
-- Dumped by pg_dump version 13.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: ratings_tconst_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ratings_tconst_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ratings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ratings (
    tconst character(9) DEFAULT ('tt'::text || lpad(((nextval('public.ratings_tconst_seq'::regclass))::character(7))::text, 7, '0'::text)) NOT NULL,
    averagerating double precision NOT NULL,
    numvotes integer NOT NULL
);


--
-- Name: titles_tconst_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.titles_tconst_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: titles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.titles (
    tconst character(9) DEFAULT ('tt'::text || lpad(((nextval('public.titles_tconst_seq'::regclass))::character(7))::text, 7, '0'::text)) NOT NULL,
    titletype text NOT NULL,
    primarytitle text NOT NULL,
    originaltitle text NOT NULL,
    isadult integer NOT NULL,
    startyear text NOT NULL,
    endyear text DEFAULT '\N'::text,
    runtimeminutes text NOT NULL,
    genres text NOT NULL
);


--
-- Data for Name: ratings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ratings (tconst, averagerating, numvotes) FROM stdin;
\.


--
-- Data for Name: titles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.titles (tconst, titletype, primarytitle, originaltitle, isadult, startyear, endyear, runtimeminutes, genres) FROM stdin;
\.


--
-- Name: ratings_tconst_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ratings_tconst_seq', 1, false);


--
-- Name: titles_tconst_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.titles_tconst_seq', 1, false);


--
-- Name: ratings ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (tconst);


--
-- Name: titles titles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.titles
    ADD CONSTRAINT titles_pkey PRIMARY KEY (tconst);


--
-- Name: ratings ratings_tconst_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_tconst_fkey FOREIGN KEY (tconst) REFERENCES public.titles(tconst) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

