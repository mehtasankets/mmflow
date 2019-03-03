import { observable } from "mobx"

class Expense {
    @observable id
    @observable description
    @observable amount
}

class ExpensesStore {
    @observable expense
}