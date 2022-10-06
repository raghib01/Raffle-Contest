const ticketCollection = require('./tickets')

exports.sellSingleTicket = (req, res) => {
    const {username, price} = req.body;
    const ticket = ticketCollection.create(username, price);
    res.status(201).json({
        message: 'Ticket created successfully',
        ticket,
    });

};

exports.sellBulkTickets = (req, res) => {
    const {username, price, quantity} = req.body;
    const tickets = ticketCollection.createBulk(username, price, quantity);

    res.status(201).json({
        message: 'Ticket create successfilly',
        tickets,
    });
};

// Find tickets controller....

exports.findAll = (req, res) => {
    const tickets = ticketCollection.find();
    res.status(200).json({items : tickets, total: tickets.length} );
}

exports.findById = (req, res) => {
    const id = req.params.id;
    const ticket = ticketCollection.findTicketById(id);
    if(!ticket) {
        return res.status(404).json({message: '404 Tickets not found'})
    }
    res.status(200).json(ticket);
};

exports.findByUsername = (req, res) => {
        const username = req.params.username;
        const tickets = ticketCollection.findTicketByUser(username);
        res.status(200).json({items: tickets, total: tickets.length});
}

//Update controllers
exports.updateById = (req, res) => {
    const id = req.params.id
    const ticket = ticketCollection.updateById(id, req.body);
    if(!ticket) {
        return res.status(404).json({message: '404 Tickets not found'})
    }
    res.status(200).json(ticket);
    
};

exports.updateByUsername = (req, res) => {
    const username = req.params.username
    const tickets = ticketCollection.updateBulk(username, req.body);
    res.status(200).json({items: tickets, total: tickets.length});

};

exports.deleteById = (req, res) => {
    const id = req.params.id
    const isdeleted = ticketCollection.deleteById(id);
    if(isdeleted) {
        return res.status(204).send();
    }
    res.status(400).json({message: 'Does not delete'});
}

exports.deleteByUsername = (req, res) => { 
    const username = req.params.username
    const isdeleteds = ticketCollection.deleteBulk(username);

    res.status(201).json({
        message: 'Ticket create successfilly',
        isdeleteds,
    });
}

//draw conrtroller

exports.drawWinners = ( req, res) => {
    const wc = req.query.wc
    const winners = ticketCollection.draw(wc);
    res.status(200).json({items: winners})
}