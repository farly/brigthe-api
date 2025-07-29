

// can i run the server?
import Request from 'supertest';
import { AppDataSource } from '../src/dataSource';
import { Service } from '../src/entities/Service';
import { createApolloServer } from '../src/server';
import { Lead } from '../src/entities/Lead';
import TestAgent from 'supertest/lib/agent';

let request: TestAgent;

beforeAll(async () => {
  const { app } = await createApolloServer();
  request = Request(app);
});

afterAll(async () => {
  // Optionally, close DB connection here
  await import('../src/dataSource').then(({ AppDataSource }) => AppDataSource.destroy());
});

describe('LeadResolver', () => {
  it('should register a lead', async () => {
    const response = await request 
      .post('/graphql')
      .send({
        query: `
          mutation Register($input: RegisterInput!) {
            register(input: $input) {
              id
              name
              email
              mobile
              postcode
              services {
                id
                name
              }
            }
          }
        `,
        variables: {
          input: {
            name: 'John Doe',
            email: 'john@example.com',
            mobile: '1234567890',
            postcode: '12345',
            services: [1],
          },
        },
      })
      .expect(200);

    expect(response.body.data.register).toHaveProperty('id');
    expect(response.body.data.register.name).toBe('John Doe');
    expect(response.body.data.register.email).toBe('john@example.com');
    expect(response.body.data.register.mobile).toBe('1234567890');
    expect(response.body.data.register.postcode).toBe('12345');
    expect(response.body.data.register.services).toHaveLength(1);
    expect(response.body.data.register.services[0]).toHaveProperty('id', service.id);
    expect(response.body.data.register.services[0]).toHaveProperty('name', service.name);
  });

  it('should fetch all leads', async () => {
    const response = await request
      .post('/graphql')
      .send({
        query: `
          query {
            leads {
              id
              name
              email
              mobile
              postcode
              services {
                id
                name
              }
            }
          }
        `,
      })
      .expect(200);

    expect(response.body.data.leads).toBeInstanceOf(Array);
    expect(response.body.data.leads.length).toBeGreaterThan(0);
    response.body.data.leads.forEach((lead: any) => {
      expect(lead).toHaveProperty('id');
      expect(lead).toHaveProperty('name');
      expect(lead).toHaveProperty('email');
      expect(lead).toHaveProperty('mobile');
      expect(lead).toHaveProperty('postcode');
      expect(lead.services).toBeInstanceOf(Array);
    });
  });
});

describe('LeadResolver - Single Lead', () => {
  it('should fetch a lead by ID', async () => {
    const service = await AppDataSource.getRepository(Service).save({ name: 'delivery' });
    const lead = await AppDataSource.getRepository(Lead).save({
      name: 'Jane Doe',
      email: 'jane@example.com',
      mobile: '0987654321',
      postcode: '54321',
      services: [service],
    });

    const response = await request 
      .post('/graphql')
      .send({
        query: `
          query GetLead($id: ID!) {
            lead(id: $id) {
              id
              name
              email
              mobile
              postcode
              services {
                id
                name
              }
            }
          }
        `,
        variables: {
          id: lead.id,
        },
      })
      .expect(200);

    expect(response.body.data.lead).toHaveProperty('id', lead.id);
    expect(response.body.data.lead.name).toBe('Jane Doe');
    expect(response.body.data.lead.email).toBe('jane@example.com');
    expect(response.body.data.lead.mobile).toBe('0987654321');
    expect(response.body.data.lead.postcode).toBe('54321');
    expect(response.body.data.lead.services).toHaveLength(1);
    expect(response.body.data.lead.services[0]).toHaveProperty('id', service.id);
    expect(response.body.data.lead.services[0]).toHaveProperty('name', service.name);
  });

  it('should return null for a non-existing lead', async () => {
    const response = await request
      .post('/graphql')
      .send({
        query: `
          query GetLead($id: ID!) {
            lead(id: $id) {
              id
              name
              email
              mobile
              postcode
              services {
                id
                name
              }
            }
          }
        `,
        variables: {
          id: 9999, // Assuming this ID does not exist
        },
      })
      .expect(200);

    expect(response.body.data.lead).toBeNull();
  });
});

