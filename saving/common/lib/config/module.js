// Module
Module = typeof Module === 'undefined' ? {} : Module;
Meteor.isClient && Template.registerHelper('Module', Module);

Module.Saving = {
    name: 'Borrowing System',
    version: '0.0.2',
    summary: 'Borrowing Management System is ...',
    roles: [
        'admin',
        'general',
        'reporter'
    ]
};
