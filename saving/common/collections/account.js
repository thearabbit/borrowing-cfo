// Collection
Saving.Collection.Account = new Mongo.Collection("saving_account");

// Schema
Saving.Schema.Account = new SimpleSchema({
    accDate: {
        type: String,
        label: "Acc Date",
        defaultValue: function () {
            var currentDate = moment(ReactiveMethod.call("currentDate"), 'YYYY-MM-DD H:mm:ss').format('YYYY-MM-DD');
            return currentDate;
        }
    },
    cpanel_currencyId: {
        type: String,
        label: "Currency",
        autoform: {
            type: "select2",
            options: function () {
                return Saving.List.currency();
            }
        }
    },
    productId: {
        type: String,
        label: "Product",
        autoform: {
            type: "select2",
            options: function () {
                return Saving.List.product();
            }
        }
    },
    term: {
        type: Number,
        autoform: {
            type: "select2",
            options: function () {
                return Saving.List.term();
            }
        }
    },
    maturityDate: {
        type: String,
        optional: true
    },
    type: {
        type: String,
        label: "Type",
        autoform: {
            type: "select2",
            options: function () {
                return Saving.List.accType();
            }
        }
    },
    taxRate: {
        type: Number,
        label: 'Tax rate (%)',
        defaultValue: function () {
            var setting = Saving.Collection.Setting.findOne();
            return setting.tax.borrowing;
        },
        decimal: true,
    },
    lenderTax: {
        type: Number,
        label: 'Lender payment for tax',
        decimal: true,
        min: 0,
        optional: true
    },
    companyTax: {
        type: Number,
        label: "Tax payment for company (%)",
        decimal: true,
        min: 0,
        optional: true,
    },
    cycle: {
        type: Number,
        label: 'Cycle',
        optional: true
    },
    memo: {
        type: String,
        label: "Memo",
        max: 500,
        optional: true
    },
    clientId: {
        type: String,
        label: "Client"
        //autoform: {
        //    type: "select2",
        //    options: function () {
        //        return Saving.List.client();
        //    }
        //}
    },
    staffId: {
        type: String,
        label: "Staff",
        autoform: {
            type: "select2",
            options: function () {
                return Saving.List.staff();
            }
        }
    },
    inheritor: {
        type: Array,
        minCount: 1,
        maxCount: 5
    },
    'inheritor.$': {
        type: Object
    },
    'inheritor.$.name': {
        type: String,
        max: 250
    },
    'inheritor.$.gender': {
        type: String,
        autoform: {
            type: "select",
            options: function () {
                return Saving.List.genderNoSelectOne();
            }
        }
    },
    'inheritor.$.des': {
        type: String,
        max: 500,
        optional: true
    },
    cpanel_branchId: {
        type: String,
        label: "Branch"
    }
});

/**
 * Attach schema
 */
Saving.Collection.Account.attachSchema(Saving.Schema.Account);

/**
 * Errors message
 */
SimpleSchema.messages({
    "companyTax": "[label] must be less than or equal tax rate",
});
