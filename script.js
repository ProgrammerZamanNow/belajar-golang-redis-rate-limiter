import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metric to track error rate
const errorRate = new Rate('errors');

// List of tokens from the database
const tokens = [
    '3b73482e-37fd-41b3-8af9-63623f05a23b',
    '8ef93522-7ec7-487f-9f8f-0a4fb4f44cc5',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440006',
    '550e8400-e29b-41d4-a716-446655440007',
    '550e8400-e29b-41d4-a716-446655440008',
    '550e8400-e29b-41d4-a716-446655440009',
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440012',
    '550e8400-e29b-41d4-a716-446655440013',
    '550e8400-e29b-41d4-a716-446655440014',
    '550e8400-e29b-41d4-a716-446655440015',
    '550e8400-e29b-41d4-a716-446655440016',
    '550e8400-e29b-41d4-a716-446655440017',
    '550e8400-e29b-41d4-a716-446655440018',
    '550e8400-e29b-41d4-a716-446655440019',
    '550e8400-e29b-41d4-a716-446655440020',
    '550e8400-e29b-41d4-a716-446655440021',
    '550e8400-e29b-41d4-a716-446655440022',
    '550e8400-e29b-41d4-a716-446655440023',
    '550e8400-e29b-41d4-a716-446655440024',
    '550e8400-e29b-41d4-a716-446655440025',
    '550e8400-e29b-41d4-a716-446655440026',
    '550e8400-e29b-41d4-a716-446655440027',
    '550e8400-e29b-41d4-a716-446655440028',
    '550e8400-e29b-41d4-a716-446655440029',
    '550e8400-e29b-41d4-a716-446655440030',
    '550e8400-e29b-41d4-a716-446655440031',
    '550e8400-e29b-41d4-a716-446655440032',
    '550e8400-e29b-41d4-a716-446655440033',
    '550e8400-e29b-41d4-a716-446655440034',
    '550e8400-e29b-41d4-a716-446655440035',
    '550e8400-e29b-41d4-a716-446655440036',
    '550e8400-e29b-41d4-a716-446655440037',
    '550e8400-e29b-41d4-a716-446655440038',
    '550e8400-e29b-41d4-a716-446655440039',
    '550e8400-e29b-41d4-a716-446655440040',
    '550e8400-e29b-41d4-a716-446655440041',
    '550e8400-e29b-41d4-a716-446655440042',
    '550e8400-e29b-41d4-a716-446655440043',
    '550e8400-e29b-41d4-a716-446655440044',
    '550e8400-e29b-41d4-a716-446655440045',
    '550e8400-e29b-41d4-a716-446655440046',
    '550e8400-e29b-41d4-a716-446655440047',
    '550e8400-e29b-41d4-a716-446655440048',
    '550e8400-e29b-41d4-a716-446655440049',
    '550e8400-e29b-41d4-a716-446655440050',
    '550e8400-e29b-41d4-a716-446655440051',
    '550e8400-e29b-41d4-a716-446655440052',
    '550e8400-e29b-41d4-a716-446655440053',
    '550e8400-e29b-41d4-a716-446655440054',
    '550e8400-e29b-41d4-a716-446655440055',
    '550e8400-e29b-41d4-a716-446655440056',
    '550e8400-e29b-41d4-a716-446655440057',
    '550e8400-e29b-41d4-a716-446655440058',
    '550e8400-e29b-41d4-a716-446655440059',
    '550e8400-e29b-41d4-a716-446655440060',
    '550e8400-e29b-41d4-a716-446655440061',
    '550e8400-e29b-41d4-a716-446655440062',
    '550e8400-e29b-41d4-a716-446655440063',
    '550e8400-e29b-41d4-a716-446655440064',
    '550e8400-e29b-41d4-a716-446655440065',
    '550e8400-e29b-41d4-a716-446655440066',
    '550e8400-e29b-41d4-a716-446655440067',
    '550e8400-e29b-41d4-a716-446655440068',
    '550e8400-e29b-41d4-a716-446655440069',
    '550e8400-e29b-41d4-a716-446655440070',
    '550e8400-e29b-41d4-a716-446655440071',
    '550e8400-e29b-41d4-a716-446655440072',
    '550e8400-e29b-41d4-a716-446655440073',
    '550e8400-e29b-41d4-a716-446655440074',
    '550e8400-e29b-41d4-a716-446655440075',
    '550e8400-e29b-41d4-a716-446655440076',
    '550e8400-e29b-41d4-a716-446655440077',
    '550e8400-e29b-41d4-a716-446655440078',
    '550e8400-e29b-41d4-a716-446655440079',
    '550e8400-e29b-41d4-a716-446655440080',
    '550e8400-e29b-41d4-a716-446655440081',
    '550e8400-e29b-41d4-a716-446655440082',
    '550e8400-e29b-41d4-a716-446655440083',
    '550e8400-e29b-41d4-a716-446655440084',
    '550e8400-e29b-41d4-a716-446655440085',
    '550e8400-e29b-41d4-a716-446655440086',
    '550e8400-e29b-41d4-a716-446655440087',
    '550e8400-e29b-41d4-a716-446655440088',
    '550e8400-e29b-41d4-a716-446655440089',
    '550e8400-e29b-41d4-a716-446655440090',
    '550e8400-e29b-41d4-a716-446655440091',
    '550e8400-e29b-41d4-a716-446655440092',
    '550e8400-e29b-41d4-a716-446655440093',
    '550e8400-e29b-41d4-a716-446655440094',
    '550e8400-e29b-41d4-a716-446655440095',
    '550e8400-e29b-41d4-a716-446655440096',
    '550e8400-e29b-41d4-a716-446655440097',
    '550e8400-e29b-41d4-a716-446655440098',
    '550e8400-e29b-41d4-a716-446655440099',
    '550e8400-e29b-41d4-a716-446655440100'
];

// Test configuration
export const options = {
    vus: 100,        // 100 virtual users
    duration: '60s', // Run for 60 seconds

    // Optional: Add thresholds to ensure performance requirements
    thresholds: {
        http_req_duration: ['p(95)<2000'],      // 95% of requests should be below 2s
        http_req_failed: ['rate>0.4', 'rate<0.6'], // Failed requests should be around 50% (40-60% range)
        errors: ['rate<0.01'],                  // Unexpected errors should be less than 1%
        checks: ['rate>0.9'],                   // Most checks should pass
    },
};

export default function () {
    // Get unique token for each VU
    const vuId = __VU - 1; // VU IDs are 1-based, array is 0-based
    const token = tokens[vuId % tokens.length]; // Cycle through tokens if more VUs than tokens

    // Set up request headers
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    // Make 2 simultaneous requests using http.batch
    const requests = [
        ['GET', 'http://localhost:3000/api/users/_current', null, { headers: headers, timeout: '30s' }],
        ['GET', 'http://localhost:3000/api/users/_current', null, { headers: headers, timeout: '30s' }]
    ];

    const responses = http.batch(requests);

    // Check both responses
    let successCount = 0;
    let rateLimitCount = 0;

    responses.forEach((response, index) => {
        const isSuccess = response.status === 200;
        const isRateLimit = response.status === 429;

        if (isSuccess) successCount++;
        if (isRateLimit) rateLimitCount++;

        // Individual response checks
        const success = check(response, {
            [`request ${index + 1} - status is 200 or 429`]: (r) => r.status === 200 || r.status === 429,
            [`request ${index + 1} - response time acceptable`]: (r) => r.timings.duration < 2000,
        });

        // Track individual errors (anything other than 200 or 429 is unexpected)
        const unexpectedError = response.status !== 200 && response.status !== 429;
        errorRate.add(unexpectedError);

        // Log unexpected errors
        if (unexpectedError) {
            console.error(`VU ${__VU} Request ${index + 1} - Unexpected error:`, {
                status: response.status,
                body: response.body,
                token: token.substring(0, 8) + '...',
                duration: response.timings.duration
            });
        }
    });

    // Summary check for this VU's batch
    const batchSummary = check({ successCount, rateLimitCount }, {
        'batch has both success and rate limit': () => successCount > 0 && rateLimitCount > 0,
        'batch has exactly 1 success': () => successCount === 1,
        'batch has exactly 1 rate limit': () => rateLimitCount === 1,
    });

    // Sleep for exactly 1 second to maintain consistent timing
    sleep(1);
}

// Setup function (optional) - runs once before the test
export function setup() {
    console.log(`Starting performance test with ${tokens.length} tokens`);
    console.log('Configuration:');
    console.log('- Virtual Users: 100');
    console.log('- Rate per VU: 2 simultaneous requests per second');
    console.log('- Target API: http://localhost:3000/api/users/_current');
    console.log('- Expected total RPS: 200 (100 success + 100 rate limited)');
    console.log('- Expected behavior: 50% success (200), 50% rate limited (429)');
}

// Teardown function (optional) - runs once after the test
export function teardown(data) {
    console.log('Performance test completed');
}