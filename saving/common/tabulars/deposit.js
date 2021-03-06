Saving.TabularTable.Deposit = new Tabular.Table({
    name: "savingDepositList",
    collection: Saving.Collection.Perform,
    autoWidth: false,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    order: [['1', 'desc']],
    columns: [
        {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.saving_depositAction},
        {data: "performDate", title: "Deposit Date"},
        //{data: "principalRe", title: "Principal Re"},
        //{data: "interestRe", title: "Interest Re"},
        {
            data: "amount",
            title: "Amount",
            render: function (val, type, doc) {
                return accounting.formatNumber(val, 2);
            }
        },
        {
            data: "principalBal",
            title: "Principal Bal",
            render: function (val, type, doc) {
                return accounting.formatNumber(val, 2);
            }
        },
        {
            data: "interestBal",
            title: "Interest Bal",
            render: function (val, type, doc) {
                return accounting.formatNumber(val, 2);
            }
        },
        {data: "status", title: "Status"},
        {
            data: "voucherId",
            title: "Voucher ID",
            render: function (val, type, doc) {
                return val.slice(-6)
            }
        },
        {data: "accountId", title: "Account ID"},
        //{data: "_account.clientId", title: "Client ID"},
        {data: "_account._client.khName", title: "Client Kh Name"}
        //{data: "_account._client.enName", title: "Client En Name"}
    ]
});