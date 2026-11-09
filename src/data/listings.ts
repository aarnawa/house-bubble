import type { Agent, Listing, Mode, PropertyType } from '../types'

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70`

const HOUSES = [
  '1564013799919-ab600027ffc6', '1568605114967-8130f3a36994', '1570129477492-45c003edd2be',
  '1512917774080-9991f1c4c750', '1600596542815-ffad4c1539a9', '1600585154340-be6161a56a0c',
  '1580587771525-78b9dba3b914', '1605276374104-dee2a0ed3cd6', '1613490493576-7fde63acd811',
  '1599809275671-b5942cabc7a2', '1576941089067-2de3c901e126', '1558036117-15d82a90b9b1',
  '1600047509807-ba8f99d2cdde', '1583608205776-bfd35f0d9f83', '1572120360610-d971b9d7767c',
  '1600566753086-00f18fb6b3ea',
].map(img)

const BUILDINGS = ['1545324418-cc1a3fa10c00', '1460317442991-0ec209397118', '1574362848149-11496d93a7c7'].map(img)

const INTERIORS = [
  '1600607687939-ce8a6c25118c', '1600566753190-17f0baa2a6c3', '1600210492486-724fe5c67fb0',
  '1502672260266-1c1ef2d93688', '1522708323590-d24dbb6b0267', '1493809842364-78817add7ffb',
  '1484154218962-a197022b5858', '1556909114-f6e7ad7d3136', '1560448204-e02f11c3d0e2',
  '1505691938895-1758d7feb511', '1540518614846-7eded433c457', '1552321554-5fefe8c9ef14',
  '1507089947368-19c1da9775ae', '1586023492125-27b2c045efd7', '1616486338812-3dadae4b4ace',
  '1600121848594-d8644e57abab',
].map(img)

export const AGENTS: Agent[] = [
  { id: 'a1', name: 'Maya Torres', brokerage: 'Bubble Realty', phone: '(512) 555-0142', color: '#ff5a5f' },
  { id: 'a2', name: 'Devon Brooks', brokerage: 'Keystone Homes', phone: '(512) 555-0187', color: '#7c5cff' },
  { id: 'a3', name: 'Priya Shah', brokerage: 'Summit & Co.', phone: '(303) 555-0119', color: '#14b8a6' },
  { id: 'a4', name: 'Sam Whitaker', brokerage: 'Front Range Realty', phone: '(303) 555-0163', color: '#f59e0b' },
  { id: 'a5', name: 'Lena Park', brokerage: 'Evergreen Partners', phone: '(206) 555-0128', color: '#22c55e' },
  { id: 'a6', name: 'Chris Okafor', brokerage: 'Sound Living', phone: '(206) 555-0174', color: '#3b82f6' },
]

export const CITIES = ['Austin', 'Denver', 'Seattle'] as const
const STATE: Record<string, string> = { Austin: 'TX', Denver: 'CO', Seattle: 'WA' }

export const MUST_HAVES = [
  'Garage', 'Yard', 'Pool', 'Fireplace', 'Home office', 'Pet friendly', 'In-unit laundry', 'View', 'Income unit',
] as const

type Row = [
  address: string, neighborhood: string, city: string, mode: Mode, type: PropertyType,
  price: number, beds: number, baths: number, sqft: number, year: number, hoa: number,
  features: string[], blurb: string, rentEstimate?: number,
]

const ROWS: Row[] = [
  // Austin
  ['1412 Ridgewood Dr', 'Travis Heights', 'Austin', 'buy', 'House', 875000, 3, 2, 1940, 1962, 0, ['Yard', 'Fireplace', 'Garage', 'Pet friendly'], 'Mid-century charmer on a tree-lined street, walkable to SoCo coffee and music.'],
  ['907 Cypress Bend', 'Mueller', 'Austin', 'buy', 'House', 649000, 3, 2.5, 2110, 2015, 85, ['Garage', 'Home office', 'Yard', 'Pet friendly'], 'Modern farmhouse steps from Mueller Lake Park and the Sunday farmers market.'],
  ['2200 Lakeshore Pt', 'Westlake', 'Austin', 'buy', 'House', 2450000, 5, 4.5, 4820, 2019, 0, ['Pool', 'View', 'Garage', 'Home office', 'Fireplace'], 'Hill Country contemporary with an infinity pool and sunset views over Lake Austin.'],
  ['55 Rainey St #1804', 'Rainey Street', 'Austin', 'buy', 'Condo', 525000, 1, 1, 860, 2017, 610, ['View', 'Pool', 'In-unit laundry', 'Pet friendly'], 'High-rise living with skyline views, a rooftop pool, and nightlife at your door.'],
  ['3318 Bluebonnet Ln', 'Zilker', 'Austin', 'buy', 'Townhouse', 799000, 2, 2.5, 1520, 2020, 140, ['Garage', 'In-unit laundry', 'Pet friendly'], 'Bike to Barton Springs from this light-filled townhome with a private rooftop deck.'],
  ['8810 Oak Hollow', 'Circle C', 'Austin', 'buy', 'House', 1125000, 4, 3, 3150, 2008, 45, ['Pool', 'Yard', 'Garage', 'Fireplace', 'Pet friendly'], 'Family-friendly cul-de-sac home with a resort-style backyard and top-rated schools.'],
  ['4021 E 12th St', 'Cherrywood', 'Austin', 'buy', 'House', 459000, 2, 1, 1080, 1948, 0, ['Yard', 'Pet friendly'], 'Cozy bungalow with original hardwoods and a big shaded yard — first-home perfect.'],
  ['600 W 6th St #712', 'Downtown', 'Austin', 'rent', 'Apartment', 2450, 1, 1, 780, 2018, 0, ['In-unit laundry', 'Pool', 'Pet friendly', 'View'], 'Downtown studio-plus with a gym, pool deck, and a 2-minute walk to work.'],
  ['1709 Kinney Ave', 'Bouldin Creek', 'Austin', 'rent', 'House', 3900, 3, 2, 1650, 1975, 0, ['Yard', 'Garage', 'Pet friendly', 'Fireplace'], 'Leafy rental house with a screened porch and a dog-ready fenced yard.'],
  ['2501 Lake Austin Blvd #3', 'Tarrytown', 'Austin', 'rent', 'Townhouse', 3200, 2, 2.5, 1300, 2012, 0, ['Garage', 'In-unit laundry', 'Home office'], 'Quiet two-level townhome near the hike-and-bike trail and Mozart’s Coffee.'],
  // Denver
  ['2845 Vallejo St', 'Highland', 'Denver', 'buy', 'House', 989000, 3, 3, 2280, 1912, 0, ['Yard', 'Fireplace', 'Garage', 'Home office'], 'Restored Victorian with a chef’s kitchen and a backyard made for summer BBQs.'],
  ['1550 Wynkoop St #503', 'LoDo', 'Denver', 'buy', 'Condo', 615000, 2, 2, 1210, 2004, 720, ['View', 'In-unit laundry', 'Pet friendly'], 'Brick-and-timber loft overlooking Union Station with mountain glimpses.'],
  ['4410 Tennyson St', 'Berkeley', 'Denver', 'buy', 'House', 749000, 3, 2, 1760, 1950, 0, ['Yard', 'Garage', 'Pet friendly'], 'Updated brick ranch a block from Tennyson’s shops, breweries, and Berkeley Lake.'],
  ['720 S Gaylord St', 'Washington Park', 'Denver', 'buy', 'House', 1675000, 4, 4, 3600, 2016, 0, ['Fireplace', 'Garage', 'Home office', 'Yard', 'View'], 'Modern build near Wash Park with a rooftop deck framing the Front Range.'],
  ['3020 Blake St', 'RiNo', 'Denver', 'buy', 'Townhouse', 685000, 2, 2.5, 1480, 2021, 160, ['Garage', 'View', 'In-unit laundry'], 'Sleek RiNo townhome surrounded by street art, food halls, and taprooms.'],
  ['9133 E Lowry Blvd', 'Lowry', 'Denver', 'buy', 'House', 1095000, 5, 3.5, 3420, 2006, 60, ['Yard', 'Garage', 'Home office', 'Fireplace', 'Pet friendly'], 'Spacious family home on a green park block with room for everyone.'],
  ['1260 Ogden St', 'Capitol Hill', 'Denver', 'buy', 'Condo', 349000, 1, 1, 690, 1928, 340, ['Pet friendly', 'Fireplace'], 'Charming vintage condo with arched doorways and a working fireplace.'],
  ['1801 Wynkoop St #1101', 'Union Station', 'Denver', 'rent', 'Apartment', 2750, 1, 1, 820, 2019, 0, ['In-unit laundry', 'View', 'Pet friendly'], 'Luxury one-bed with floor-to-ceiling windows and a rooftop hot tub.'],
  ['3555 W 32nd Ave', 'West Highland', 'Denver', 'rent', 'House', 4100, 3, 2.5, 1900, 2001, 0, ['Yard', 'Garage', 'Pet friendly', 'Fireplace'], 'Craftsman rental with a mudroom, fenced yard, and mountain-view porch.'],
  ['2150 S Downing St #4', 'Platt Park', 'Denver', 'rent', 'Townhouse', 2950, 2, 1.5, 1150, 1998, 0, ['In-unit laundry', 'Home office', 'Pet friendly'], 'Walk to Old South Pearl’s farmers market from this sunny townhome.'],
  // Seattle
  ['4417 Interlake Ave N', 'Wallingford', 'Seattle', 'buy', 'House', 1185000, 3, 2, 1980, 1924, 0, ['Yard', 'Fireplace', 'View', 'Home office'], 'Classic Craftsman with peekaboo lake views and a gardener’s dream yard.'],
  ['1521 2nd Ave #2304', 'Belltown', 'Seattle', 'buy', 'Condo', 895000, 2, 2, 1180, 2009, 980, ['View', 'In-unit laundry', 'Pet friendly'], 'Sound and Olympics views from every room, minutes from Pike Place.'],
  ['6512 32nd Ave NW', 'Ballard', 'Seattle', 'buy', 'Townhouse', 829000, 3, 2.5, 1560, 2018, 0, ['Garage', 'View', 'In-unit laundry', 'Pet friendly'], 'Rooftop-deck townhome near Ballard Ave’s restaurants and the Locks.'],
  ['2209 E Lynn St', 'Montlake', 'Seattle', 'buy', 'House', 1595000, 4, 3, 2840, 1931, 0, ['Yard', 'Fireplace', 'Garage', 'Home office'], 'Tudor revival near the Arboretum with a remodeled kitchen and sunroom.'],
  ['10420 Rainier Ave S', 'Rainier Beach', 'Seattle', 'buy', 'House', 685000, 3, 1.5, 1490, 1957, 0, ['Yard', 'View', 'Pet friendly'], 'Lake Washington views and a big lot — one of the city’s best values.'],
  ['8201 Seward Park Ave S', 'Seward Park', 'Seattle', 'buy', 'House', 2290000, 5, 4, 4100, 2014, 0, ['View', 'Garage', 'Fireplace', 'Home office', 'Yard'], 'Waterfront-adjacent modern with a wall of glass facing the Cascades.'],
  ['1100 E Pike St #405', 'Capitol Hill', 'Seattle', 'buy', 'Condo', 489000, 1, 1, 640, 2015, 450, ['In-unit laundry', 'Pet friendly'], 'Efficient one-bed in the heart of the Hill, above cafés and bookstores.'],
  ['300 Boren Ave N #1210', 'South Lake Union', 'Seattle', 'rent', 'Apartment', 2895, 1, 1, 720, 2020, 0, ['In-unit laundry', 'View', 'Pet friendly'], 'Lake-view apartment with a dog spa, coworking lounge, and rooftop fire pits.'],
  ['5609 Phinney Ave N', 'Phinney Ridge', 'Seattle', 'rent', 'House', 4500, 3, 2, 1820, 1938, 0, ['Yard', 'Fireplace', 'Pet friendly', 'Home office'], 'Storybook rental steps from Woodland Park and the zoo.'],
  // Income properties
  ['2709 Pecan Springs Rd', 'Montopolis', 'Austin', 'buy', 'House', 399000, 4, 2, 1880, 1984, 0, ['Income unit', 'Yard', 'Pet friendly'], 'Side-by-side duplex (2 bd / 1 ba each), both units leased — live in one, rent the other.', 3900],
  ['1340 Peoria St', 'East Colfax', 'Denver', 'buy', 'House', 689000, 6, 3, 3150, 1962, 0, ['Income unit', 'Garage', 'In-unit laundry'], 'Brick triplex with three 2-bed units and off-street parking — a classic cash-flow building.', 5700],
  ['3912 S Hudson St', 'Beacon Hill', 'Seattle', 'buy', 'House', 749000, 4, 3, 2050, 1951, 0, ['Income unit', 'Yard', 'View', 'Pet friendly'], 'Updated house plus a new backyard cottage (DADU) with its own entrance and lease.', 5600],
  ['4730 University Way NE #2', 'University District', 'Seattle', 'rent', 'Townhouse', 3100, 2, 1.5, 1020, 2011, 0, ['In-unit laundry', 'Garage'], 'Light-rail adjacent townhome — downtown in 8 minutes, no car needed.'],
]

export const LISTINGS: Listing[] = ROWS.map((r, i) => {
  const [address, neighborhood, city, mode, type, price, beds, baths, sqft, yearBuilt, hoa, features, blurb, rentEstimate] = r
  const isUnit = type === 'Apartment' || type === 'Condo'
  const cover = isUnit ? BUILDINGS[i % BUILDINGS.length] : HOUSES[i % HOUSES.length]
  const n = INTERIORS.length
  const photos = [cover, INTERIORS[(i * 3) % n], INTERIORS[(i * 3 + 1) % n], INTERIORS[(i * 3 + 2) % n]]
  if (i % 2 === 0) photos.push(INTERIORS[(i * 5 + 7) % n])
  const agents = AGENTS.filter((a) => a.phone.includes(city === 'Austin' ? '512' : city === 'Denver' ? '303' : '206'))
  return {
    id: `l${i + 1}`,
    address, neighborhood, city, state: STATE[city], mode, type, price, beds, baths, sqft, yearBuilt, hoa,
    features, blurb, photos, rentEstimate,
    daysOnMarket: ((i * 7) % 23) + 1,
    agentId: agents[i % agents.length].id,
  }
})

export const agentFor = (l: Listing) => AGENTS.find((a) => a.id === l.agentId)!
