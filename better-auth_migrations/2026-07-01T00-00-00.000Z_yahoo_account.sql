create table "yahoo_account" ("id" text not null primary key, "userId" text not null references "user" ("id") on delete cascade, "email" text not null, "appPassword" text not null, "createdAt" timestamptz default CURRENT_TIMESTAMP not null, "updatedAt" timestamptz default CURRENT_TIMESTAMP not null);

create unique index "yahoo_account_userId_idx" on "yahoo_account" ("userId");
