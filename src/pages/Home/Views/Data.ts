export interface Article {
  category: string;
  date: string;
  title: string;
  desc: string;
  tags: string[];
  image: string;
}

export const ARTICLES: Article[] = [
  {
    category: 'Design',
    date: 'March 2024',
    title: 'The Architecture of Silence in UI',
    desc: 'Exploring how intentional whitespace creates a more focused and premium user experience in modern digital galleries.',
    tags: ['Minimalism', 'White Space'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7-sT1TpEij0E9w0zZtF7gtabxEE9zZngrG3nzuY7CCVL2PQHc-lq2Whe-LBc9IdtL-x5ehoROsRfCKLZdCQLiVtnwisXFJ5caGJAoKD6bKH9pbcykjps6BzawCc8sn5y-eqZGweidu8rC6LtQuHLNnFmbKzLkyosBHMI39ZFvKqz-e4-sZIckLvACivEykfFohQ6mUyZC_m5Ki1W-CNgQ_dGNIapVs2FlrsSUR7tvhDzV066QqEnzyaFofQRuAuanSvn0vQWDIhKC'
  },
  {
    category: 'Development',
    date: 'February 2024',
    title: 'Performance as Art',
    desc: 'Why the speed of an interface is just as important as the visual weight of its components.',
    tags: ['V8', 'Efficiency'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmc1V6Ns-h1OzFoWbxLflMOMqFJWDzScviCuK2HMZh_nwl42J_nwl42J_M3OLP6VvptyWWycfhV9Y9N_wE1AX7hsBTIzEOCHIoVBn4HDZc5Drhuqc3ET8p868kq6ntV-DaATYPGDFLIWhVlJ8UdQUnokfln-nRww_Y57DGWRdIX4GIla0JgHwkAiccSg9HyWzAq1FApoiA220el3lkdIfY5jgdhfl9UwwilpSN-r7kO7hLh9Xz_D5SkOmvBWSz_h11ZR2TwSyepHXqsoNeQ2a'
  },
  {
    category: 'Philosophy',
    date: 'January 2024',
    title: 'Digital Impermanence',
    desc: 'Accepting the fleeting nature of digital trends while building for long-term artistic integrity.',
    tags: ['Ethics', 'Art'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCP69KlPeWP_VNp4Ko05_eZLMWyw-BASEaY_jbfZvE0Z2E9TjCvEPW20JKn0ivH9iC1y0TKBWZX3MVqD15S2TJ6V_4unwncyZ-2RkeJ_1y4rDNR0QY5yqKNI7ue41eKgSOXOPR3jNRVmzhvomegZQtwT4UuoN4q6lq0NyOvUmVqt_JEgApvOf7kSPXU1dlFsl2sxYzcYhVkrQtLWaK52GRr0hT2TzhXf2wsyQQUup3lJ4zgBcCp0t_huHMXn4RkisknAF6SXopfpjiZ'
  }
];

export const GRID_ITEMS = [
  {
    category: 'Case Study',
    title: 'Concrete Dreams',
    desc: 'Visualizing the brutalist aesthetic within a fluid web framework.',
    tags: '#architecture #web3',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOQ0uFRfWgiMS05kkqutiw3-NW8YNsgp8KJjnb67u-fh9cdfJ9EW9e8fyWHkDzHNhRZ6xo3mcXnw7KKLhvmx90xkLd6H37KKLhvmx90xkLd6H3ldGpyADqXFGTGSoR4ND_hUtJcJO8TVK3fusT0Np0zkahUTXFFT5WfKRrq2WqbLE5ukPxwlk1uGXOAbMCBjlvXLLMYRVPyCBftKdY4UuEOarBY3JPTQS7h3JEBjqhH5gcZOSu6hUjpTVfVdsHGuAhPcjIMXVVf_EkFWx1kIcfJSxRPyxEA'
  },
  {
    category: 'Experiment',
    title: 'Liquid Motion',
    desc: 'Using CSS shaders to simulate biological fluidity in UI components.',
    tags: '#shaders #webgl',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHAKWlgc1KLDpeZgxK-JHANUB3LX0S3eria-AOFELBh2qzNFLGXSpSnuf6e0PSxXD_gahkkdYtp2RGdMnQWlzjmFX_dK_liPEsx8O58Lg4YFItxz96IK0wKecyVMuGljn41dbf9C3t8Gl6vV-SWwJUud3UVLEzJvJJStQmL0K7jGQvjQPAbvelZ3ntFEvjFJa6GvEfE_UH8ZBCOGebe8yu0EaUG3-6KVxG8VWgt6MWdc05aCJ6mX18XKo_DFbi0yY2c8kaQuNvuVTG'
  },
  {
    category: 'Lifestyle',
    title: 'The Dark Studio',
    desc: 'Creating an environment that fosters deep work and creative flow.',
    tags: '#focus #studio',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8nWmvDvyDSfG9JqVzLharwxxiXwn5HFEXSOmkZ8B1hp5vw-rcbHLYUPnCVxf16Y_rPvuDlWcBOhacewwOvb2qjDCGDKZ4kg7jUISiBVJKvWeWowvlIydRZat13Ii1kOdJSW-f6-ZL6jZeMyvnxdrwry0Bo3wP5SIiTvAfH4hiS8LRLDOruKtgqv_fsMQHTJIhV9NN3K-sytEkIiVcHzIHYsGOX89vW3GTRzQqnhaUUUKAGUckXOKvGmtwaaGQWoC6-QDBSV5d0Tdm'
  }
];

export const IMMERSIVE_SERIES = [
  {
    id: '01',
    title: 'Luminous Living',
    desc: 'How light defines the shape of our digital interactions and physical spaces.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDOloYGJ7LVbnl6nGfoKghiJBPr6arc8up_tH_IoxoG-0yK4k0W6Jc5fkFngpagAjv8kVH27wSPvcuSO2e29JfEvgU_l4IAKFWSSOCYD1vJi0bRCVYvaB1OyGv9IxaRcz9c5lgb9-vHmMiC3WGl8A5yBaipv6LE6A2rvYAW2xjDoEZ4685pkAJbPGAOs6P0GUyudBoWCXjoHan5_95scqzZeTRI98ar1gpyrEFvh0U8WREAXd1spcC-QOlcnisRGwZOmtBqVtnAx2d'
  },
  {
    id: '02',
    title: 'Global Pulse',
    desc: 'Mapping the movement of data across the obsidian-glass network.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2Nduao659ETwQBSwddIkYG4VrEzhoDwaA20JnOzULkl3x8W0C97sf19l400Vt_rosm8DKSpR6vJ9zmw2jm8PnjFBN5U0D-zkwLc78pyzV8hj1VG1YOlU4aPkbac__ht3EiXXUjsTXs3lDt-jBStcVxaWHgwIRlQdDt9ofrDiUelmVmp19vTAdmWAZL9o1Riza1BTCw5zLLNZlKdX6B1bYeBDD3VOgkMSm0Varx3qvLlRCqc30sy30BAf_nFRdZ0hYPavmeXMU5fDq'
  }
];

export const PHOTOS = [
  { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIA3qGHyYKUZMU0jD-kJ_7t8NVwwKOLeXUFlZQ0NLdiIhWsxQGOlZ8lYgAcLs-zTZp0lHHze33oIX9xKCLjkgYvgidlbjcTUW6xB--qw5T_Nh-vhWOvRKdxSoMwHxhkOgVy2YnognoZN8Vl13hanzMm0zV47ykkwgZixR-VEz1n_8vpfwopZ9-ZvhkBrAsjNCw9zgzSffrZlypMijnQE6vlzlAajld8HnTsAvJKaVriW3zhFzi4NwsPYc0Q3Fb4lepHgWAbFCOjcr6', rotate: -6, top: '2%', left: '8%', aspect: '3/4', width: '20rem', delay: 0.1, direction: 'right' as const },
  { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_9FD_ohMA_CMT5M_MN_WkTf3z5JeOn74B5782t6_byUjAetJk5vu9x3tlv_AVNUx1FhA_tMG_9FuC-aBhMNDeWfx7h0QGRPPv1CMVnZj-PbRMAYk6woTcqqbpuLHwGneFOnx2YPaF6xEkDlHujzfVGST4bUKKTMnnX6-u_gVw1BJYQDwDVRBZuvsEqvLUP9p2mZjTxBPnZjkO9pKXKz0jsV3TbEQ5P0dRVSXfQulasp_uwGIRa69Ci-QVoKlwtPyqzSQVazDBQ6cO', rotate: 2, top: '12%', left: '38%', aspect: 'video', width: '22rem', delay: 0.3, direction: 'up' as const },
  { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWDLLei7_KPGroiZnq9_2tIUh61oVwEvAIMFYn30S-Mnsko9vVp_NQyD1Ya6Hkb_aa_gctQgqDDCpa_tsitzAY0CSdknNDzCJFdCSuW2pEAF-wyrDVpmrRXboiBoud--t3mILVZz9VpDUx1ApiwVG_M88zX1hnXBUdiaw-LywOWpyo18yX2bMp7EaTUYlqLTEElOL6Sa2tGX1tB86aaYMIg_MzzEUUPqM8lHhiS2p5UGFbg75IJXTHF-oE6JWJc6CpPGMDjPyDwJQq', rotate: -2, top: '8%', right: '8%', aspect: '4/5', width: '22rem', delay: 0.2, direction: 'left' as const },
  { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZmkt-GnprN5U1x-uwujL1vk3hWaC7U23-rTxShI8R5NW2p6Uz7qw6t8Uxl2hcavH-rQyKSYKKc-2-5siBPfOowCSavKpeLavfw3Gta3HzIJI3vFCrdLmAHKit2bXFcMHKJx2OyQXQM7ucpCoxhz0J1MMWGVMmrmzqoYCxmh0GDaehAjiM4G5bXggRalVAZedeSHiV41AX5hcT8EC4awY74WskFXEyfLu4tI9CTBFV7aTglrYEWgB3M9zMFLMEI6Ry-MANapdTYTrt', rotate: 5, bottom: '8%', left: '12%', aspect: 'video', width: '22rem', delay: 0.4, direction: 'right' as const },
  { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbmkqUqrwTi6_xIC9m0bNo-QiaXGJ56I8SJlXXA0va5-fcsNc_s3tJ-2ZYbOAaJF1JhpHZKoBauY9khFpga6Uzppkflk74PZKhhvV3CsoquQ4ecpaJQvWQZnu6h9KN62EOabCtjnbEWZIB7ufcSI-giSqloLDTHYbtvyo6D3oxqt8TslIds97ObBeqUhXCs9LwGyOr9aNZ-ru04a7rb6OzYP-FMKDmuB2YkXQLBmpamICZ5x3njEiNv2XrNrFWavD7hQOueb2yYv6I', rotate: -6, bottom: '2%', left: '42%', aspect: '3/4', width: '18rem', delay: 0.5, direction: 'up' as const },
  { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnwvZQMzFhPt2NTuRbETH1cROsallz6iNuxk1P5jWRDMI-heyGmAR6_csUIRmYabRAgaOEBPgBW-wQrbYjSgQIhE7PajECmorj6Ai1Z_7TKK83jKmN4pDNmoj_eZ77dAzclmUhU_p1xU_EDzLdQPoxszy80ZEoHNbHFWcTPHY6G7was_l_RBjz7NA93wOdCAmasJgreHGRgZtnMhv2tw-6iGtAWceKneP60yOqvsbPc1vEyBuwoNc5R4WKKoErhwT8mfeEK4y0fE0S', rotate: 3, bottom: '12%', right: '8%', aspect: 'video', width: '26rem', delay: 0.6, direction: 'left' as const }
];
