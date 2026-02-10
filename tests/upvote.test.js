const request = require('supertest');
const app = require('../app');
const Upvote = require('../models/upvotes');
const User = require('../models/user');
const Request = require('../models/request');

describe('POST /feedback/:id/upvote', () => {    
    let agent;

    beforeAll(async () => {
        agent = request.agent(app);
    });

    beforeEach(async () => {
        await Upvote.deleteMany({});
        await Request.deleteMany({});
        await User.deleteMany({});

        const user = new User({
            email: 'test@gmail.com', 
            name: 'Test User', 
            username: 'testuser',
            image: [{ 
                url: 'https://placeholder.com/image.jpg',
                filename: 'test-image'
            }]
        });
        
        await User.register(user, 'testpassword');
        
        await agent
            .post('/feedback/login')
            .send({ username: 'testuser', password: 'testpassword' });
    });

    it('should increment the upvote count by exactly 1', async () => {
        const testRequest = await Request.create({
            title: "Fix the sidebar bug",
            category: "bug",
            upvotes: 3
        });

        const res = await agent
            .post(`/feedback/${testRequest._id}/upvote`)
            .send();

        expect(res.status).toBe(200);
        const updatedRequest = await Request.findById(testRequest._id);
        expect(updatedRequest.upvotes).toBe(4);
    });
});