const Ticket = require('./Ticket');
const {readFile, writeFile} = require('./utils');

// for sequrity purpuse.....
const tickets = Symbol('tickets');

class TicketCollection {
    constructor() {
        (async function () {
            this[tickets] = await readFile();
        }.call(this));
    }
/**
 * Create and save a new tickets
 * @param {string} username 
 * @param {number} price 
 * @return {Ticket}
 */
    create(username, price) {
        const ticket = new Ticket(username, price);
        this[tickets].push(ticket);
        writeFile(this[tickets]);
        return ticket;
    }
    /**
     * 
     * @param {string} username 
     * @param {number} price 
     * @param {number} quantity 
     * @return {Ticket[]}
     */

    createBulk (username, price, quantity) {
        const result = [];
        for (let i = 0; i < quantity; i++){
            const ticket = this.create(username, price);
            result.push(ticket);

        }
        writeFile(this[tickets]);
        return result;
    }

    find(){
        return this[tickets];
    }
    /**
     * 
     * @param {string} id 
     * @returns 
     */

    findTicketById(id){
        const userTickets = this[tickets].find(
            /**
             * @param {Ticket} tickets
             */
            (ticket) => ticket.id === id
        )
        return userTickets;
    }
    
    /**
     * find ticket by username,
     * @param {string} username 
     */
    findTicketByUser(username){
        const userTickets = this[tickets].filter(
            /**
             * @param {Ticket} ticket
             */
            (ticket) => ticket.username ===username
        );
        return userTickets;
    }

    /**
     * 
     * @param {string} ticketid 
     * @param {{username:string, price: number}} ticketbody 
     * @return {Ticket}
     */

    updateById(ticketid, ticketbody){
        const ticket = this.findTicketById(ticketid);
        if(ticket) {
            ticket.username = ticketbody.username ?? ticket.username;
            ticket.price = ticketbody.price ?? ticket.price;
    
        }
        writeFile(this[tickets]);
        return ticket;

    }
    /**
     * 
     * @param {string} username 
     * @param {{username: string, price: number}} ticketbody 
     * @return {Ticket[]}
     */
    updateBulk (username, ticketbody){
        const userTickets = this.findTicketByUser(username);
        const updateTicket = userTickets.map(
            /**
             * @param {Ticket} ticket
             */
            (ticket) => this.updateById(ticket.id, ticketbody)
        )
        writeFile(this[tickets]);
        return updateTicket;
    }
    /**
     * delete ticket by ID
     * @param {string} ticketid 
     * @return {boolean}
     */

    deleteById(ticketid){
        const index = this[tickets].findIndex(
            /**
             * @param {Ticket} ticket
             */
            (ticket) => ticket.id === ticketid
        );
        if(index === -1){
            return false;
        }else{
            this[tickets].splice(index, 1);
            writeFile(this[tickets]);
            return true;
        };
    };

    /**
     * 
     * @param {string} username 
     * @return {boolean[]}
     */
    deleteBulk(username) {
        const userTickets = this.findTicketByUser(username);
        const deletedresult = userTickets.map(
            /**
             * 
             * @param {Ticket} ticket 
             * @returns 
             */
            (ticket) => this.deleteById(ticket.id)
        )
        writeFile(this[tickets]);
        return deletedresult;
    }
 
    /**
     * count winner
     * @param {number} winnerCount 
     * @return {Ticket[]}
     */
    draw(winnerCount){
        const winnerIndexs = new Array(winnerCount);
        let winnerIndex = 0;
        while (winnerIndex < winnerCount) {
            let ticketIndex = Math.floor(Math.random() * this[tickets].length);
            if(!winnerIndexs.includes(ticketIndex)){
                winnerIndexs[winnerIndex++] = ticketIndex;
                continue;
            };
        };
        const winners = winnerIndexs.map(
            
            /**
             * 
             * @param {number} index 
             * @returns 
             */
            (index) => this[tickets][index]
        );
        return winners;

    }
}

const collection = new TicketCollection();
module.exports = collection;
