Meteor.methods({
    getWithdrawalReport: function (arg) {
        var self = arg;
        var data = {
            title: {},
            header: [],
            content: [],
            footer: []
        };

        /********* Title *********/
        var company = Cpanel.Collection.Company.findOne();
        data.title = {
            company: company,
            date: self.date
        };

        /********* Header ********/
        var exchange = Cpanel.Collection.Exchange.findOne(self.exchange);
        data.header = [
            {col1: 'Branch: ' + self.branch, col2: 'Staff: ' + self.staff},
            {col1: 'Currency: ' + self.currency, col2: 'Exchange: ' + EJSON.stringify(exchange.rates)},
            {col1: 'Product: ' + self.product, col2: ''}
        ];

        /********** Content & Footer **********/
        var content = [];
        var date = s.words(self.date, ' To ');
        //var fDate = moment(date[0], 'YYYY-MM-DD').toDate();
        //var tDate = moment(date[1], 'YYYY-MM-DD').add(1, 'day').toDate();

        // Config fx
        fx.base = exchange.base;
        fx.rates = exchange.rates;

        // Get account selector
        var accountSelector = {};
        if (!_.isEmpty(self.branch)) {
            accountSelector.cpanel_branchId = {$regex: self.branch};
        }
        if (!_.isEmpty(self.currency)) {
            accountSelector.cpanel_currencyId = {$regex: self.currency};
        }
        if (!_.isEmpty(self.product)) {
            accountSelector.productId = {$regex: self.product};
        }
        if (!_.isEmpty(self.staff)) {
            accountSelector.staffId = {$regex: self.staff};
        }

        var getAccount = Saving.Collection.Account.find(accountSelector)
            .map(function (obj) {
                return obj._id;
            });

        // Get content
        var getPerform = Saving.Collection.Perform.find({
            amount: {$lt: 0},
            accountId: {$in: getAccount},
            performDate: {$gte: date[0], $lte: date[1]}
        }, {
            sort: {performDate: 1}
        });

        var index = 1;
        var totalAmount = {KHR: 0, USD: 0, THB: 0, all: 0};
        var totalTax = {KHR: 0, USD: 0, THB: 0, all: 0};
        var totalLenderTax = {KHR: 0, USD: 0, THB: 0, all: 0};

        getPerform.forEach(function (obj) {
            var account = Saving.Collection.Account.findOne(obj.accountId);
            var client = Saving.Collection.Client.findOne(account.clientId);
            var product = Saving.Collection.Product.findOne(account.productId);
            var staff = Saving.Collection.Staff.findOne(account.staffId);
            var amount = -obj.amount;

            // Check currency
            if (account.cpanel_currencyId == 'KHR') {
                totalAmount.KHR += amount;
                totalAmount.all += fx.convert(amount, {from: 'KHR', to: 'USD'});

                totalTax.KHR += obj.withFields.tax;
                totalTax.all += fx.convert(obj.withFields.tax, {from: 'KHR', to: 'USD'});

                totalLenderTax.KHR += obj.withFields.lenderTax;
                totalLenderTax.all += fx.convert(obj.withFields.lenderTax, {from: 'KHR', to: 'USD'});

            } else if (account.cpanel_currencyId == 'USD') {
                totalAmount.USD += amount;
                totalAmount.all += amount;

                totalTax.USD += obj.withFields.tax;
                totalTax.all += obj.withFields.tax;

                totalLenderTax.USD += obj.withFields.lenderTax;
                totalLenderTax.all += obj.withFields.lenderTax;
            } else {
                totalAmount.THB += amount;
                totalAmount.all += fx.convert(amount, {from: 'THB', to: 'USD'});

                totalTax.THB += obj.withFields.tax;
                totalTax.all += fx.convert(obj.withFields.tax, {from: 'THB', to: 'USD'});

                totalLenderTax.THB += obj.withFields.lenderTax;
                totalLenderTax.all += fx.convert(obj.withFields.lenderTax, {from: 'THB', to: 'USD'});
            }

            content.push(
                {
                    index: index,
                    accountId: obj.accountId,
                    client: client,
                    product: account.productId,
                    activeDate: obj.performDate,
                    principalRe: numeral(obj.principalRe).format('0,0.00'),
                    interestRe: numeral(obj.interestRe).format('0,0.00'),
                    amount: numeral(amount).format('0,0.00'),
                    tax: numeral(obj.withFields.tax).format('0,0.00'),
                    lenderTax: numeral(obj.withFields.lenderTax).format('0,0.00'),
                    currency: account.cpanel_currencyId,
                    status: obj.status,
                    voucherId: obj.voucherId,
                    staff: staff,
                    branch: obj.cpanel_branchId
                }
            );
            index += 1;
        });

        if (content.length > 0) {
            data.content = content;
            data.footer = [
                {
                    title: 'Withdrawal Amount',
                    col1: numeral(totalAmount.KHR).format('0,0.00'),
                    col2: numeral(totalAmount.USD).format('0,0.00'),
                    col3: numeral(totalAmount.THB).format('0,0.00'),
                    col4: numeral(totalAmount.all).format('0,0.00')
                },
                {
                    title: 'Tax Amount',
                    col1: numeral(totalTax.KHR).format('0,0.00'),
                    col2: numeral(totalTax.USD).format('0,0.00'),
                    col3: numeral(totalTax.THB).format('0,0.00'),
                    col4: numeral(totalTax.all).format('0,0.00')
                },
                {
                    title: 'Lender Tax Amount',
                    col1: numeral(totalLenderTax.KHR).format('0,0.00'),
                    col2: numeral(totalLenderTax.USD).format('0,0.00'),
                    col3: numeral(totalLenderTax.THB).format('0,0.00'),
                    col4: numeral(totalLenderTax.all).format('0,0.00')
                }
            ];

            return data;
        } else {
            data.content.push({index: 'no results'});
            return data;
        }
    }
});