# Exercise 1: Normalization

## 1. What columns violate 1NF?

The first column **member_id** violates the rule for no duplicate records (every record has a primary key).

Column **dinner_date** provides different ways to show the date. Actually, we should use the date type (2020-03-15). So, dinner_date violates the second rule of 1NF: values in the column should be the same type.

The last two columns — **food_code** and **food_description** — contain multiple values. So, these columns violate the first rule of 1NF: each column should have an atomic value.

## 2. What entities do you recognize that could be extracted?

If the main task of the table is to keep track of the dinners had by members, I think, the column member_address is not in need.

## 3. Name all the tables and columns that would make a 3NF compliant solution

To fulfill 3NF it should break the table into 4:

1. `members`
   +---------------------------------------+
   member_id | member_name | member_address
   +---------------------------------------+

2. `dinners`
   +-----------------------------------+
   dinner_id | dinner_date | venue_code
   +-----------------------------------+

3. `venues`
   +-----------------------------+
   venue_code | venue_description
   +-----------------------------+

4. `food`
   +----------------------------+
   food_code | food_description
   +----------------------------+

To connect the `members` table with the `dinners` and `food` tables, I need to create three more connecting tables. To join `dinners` and `venues` I need to add column `venue_code` to `dinners` table.

5. `members_dinners`
   +----------------------+
   member_id | dinner_id
   +----------------------+

6. `members_food`
   +---------------------+
   member_id | food_code
   +---------------------+

7. `dinners_food`
   +---------------------+
   dinner_id | food_code
   +---------------------+
