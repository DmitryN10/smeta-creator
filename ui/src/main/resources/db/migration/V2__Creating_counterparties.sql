create table counterparty
(
    id serial,
    positionNumber character(50),
    name character(200),
    city character(100),
    region character(100),
    regionId integer,
    index character(100),
    address character(200)
);