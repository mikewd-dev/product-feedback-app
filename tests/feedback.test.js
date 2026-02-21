const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const Request = require('../models/request');

describe('POST /feedback', () => {
    let agent;

    beforeAll(async () => {
         await User.deleteMany({});
    await Request.deleteMany({});
        agent = request.agent(app);
    });

  beforeEach(async () => {
       
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

       
        const loginRes = await agent
            .post('/feedback/login')
            .send({ username: 'testuser', password: 'testpassword' });

       
        if (loginRes.status !== 302) {
            console.error("Login failed! Response body:", loginRes.text);
        }
        expect(loginRes.status).toBe(302);
        expect(loginRes.header.location).toBe('/feedback/suggestions');
    });
    it('should create a new feedback and redirect', async () => {
        const res = await agent
            .post('/feedback')
            .send({
                request: {
                    title: "Test Feedback",
                    description: "This is a test feedback.",
                    category: "Feature"
                }
            });

        expect(res.status).toBe(302);
        expect(res.header.location).toMatch(/\/feedback\/[a-f0-9]+/);
    });

    it("should create feedback and render it on the suggestions page", async () => {
        const createRes = await agent
            .post('/feedback')
            .send({
                request: {
                    title: "Test Feedback",
                    description: "This is a test feedback.",
                    category: "Feature"
                }
            });

   
        const feedbackInDb = await Request.find({});
      
        const res = await agent.get('/feedback/suggestions');
        expect(res.status).toBe(200);
        expect(res.text).toContain("Test Feedback");
    });
});