CREATE TABLE expense_sheets (
    user_identity TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    shared_with TEXT
);

INSERT INTO expense_sheets values ('103061349669344984576', 'Monthly Expenses', 'To manage monthly expenditures', null);