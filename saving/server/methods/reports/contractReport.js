Meteor.methods({
    getContractReport: function (arg) {
        var self = arg;
        var data = {};

        /********* Title *********/
        data.company = Cpanel.Collection.Company.findOne();

        /********* Header ********/
        data.accountDoc = Saving.Collection.Account.findOne(self.accountId);
        data.firstDeposit = Saving.Collection.Perform.findOne({
            accountId: self.accountId,
            amount: {$gt: 0}
        }, {sort: {_id: -1}});

        if (data.accountDoc) {
            data.productDoc = Saving.Collection.Product.findOne(data.accountDoc.productId);
            data.clientDoc = Saving.Collection.Client.findOne(data.accountDoc.clientId);
            data.staffDoc = Saving.Collection.Staff.findOne(data.accountDoc.staffId);
            data.branchDoc = Cpanel.Collection.Branch.findOne(data.accountDoc.cpanel_branchId);
        }

        return data;
    }
})