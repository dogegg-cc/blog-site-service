import React from 'react';
import SectionReveal from '@/components/Motion/SectionReveal';
import ArtisticCard from '@/components/Common/ArtisticCard';
import styles from './Home.module.less';

interface Article {
  category: string;
  date: string;
  title: string;
  desc: string;
  tags: string[];
  image: string;
}

const ARTICLES: Article[] = [
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
  }
];

const GRID_ITEMS = [
  {
    category: 'Case Study',
    title: 'Concrete Dreams',
    desc: 'Visualizing the brutalist aesthetic within a fluid web framework.',
    tags: '#architecture #web3',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOQ0uFRfWgiMS05kkqutiw3-NW8YNsgp8KJjnb67u-fh9cdfJ9EW9e8fyWHkDzHNhRZ6xo3mcXnw7KKLhvmx90xkLd6H3ldGpyADqXFGTGSoR4ND_hUtJcJO8TVK3fusT0Np0zkahUTXFFT5WfKRrq2WqbLE5ukPxwlk1uGXOAbMCBjlvXLLMYRVPyCBftKdY4UuEOarBY3JPTQS7h3JEBjqhH5gcZOSu6hUjpTVfVdsHGuAhPcjIMXVVf_EkFWx1kIcfJSxRPyxEA'
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

const PHOTOS = [
    { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIA3qGHyYKUZMU0jD-kJ_7t8NVwwKOLeXUFlZQ0NLdiIhWsxQGOlZ8lYgAcLs-zTZp0lHHze33oIX9xKCLjkgYvgidlbjcTUW6xB--qw5T_Nh-vhWOvRKdxSoMwHxhkOgVy2YnognoZN8Vl13hanzMm0zV47ykkwgZixR-VEz1n_8vpfwopZ9-ZvhkBrAsjNCw9zgzSffrZlypMijnQE6vlzlAajld8HnTsAvJKaVriW3zhFzi4NwsPYc0Q3Fb4lepHgWAbFCOjcr6', rotate: -6, top: '5%', left: '5%' },
    { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_9FD_ohMA_CMT5M_MN_WkTf3z5JeOn74B5782t6_byUjAetJk5vu9x3tlv_AVNUx1FhA_tMG_9FuC-aBhMNDeWfx7h0QGRPPv1CMVnZj-PbRMAYk6woTcqqbpuLHwGneFOnx2YPaF6xEkDlHujzfVGST4bUKKTMnnX6-u_gVw1BJYQDwDVRBZuvsEqvLUP9p2mZjTxBPnZjkO9pKXKz0jsV3TbEQ5P0dRVSXfQulasp_uwGIRa69Ci-QVoKlwtPyqzSQVazDBQ6cO', rotate: 2, top: '15%', left: '35%' },
    { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWDLLei7_KPGroiZnq9_2tIUh61oVwEvAIMFYn30S-Mnsko9vVp_NQyD1Ya6Hkb_aa_gctQgqDDCpa_tsitzAY0CSdknNDzCJFdCSuW2pEAF-wyrDVpmrRXboiBoud--t3mILVZz9VpDUx1ApiwVG_M88zX1hnXBUdiaw-LywOWpyo18yX2bMp7EaTUYlqLTEElOL6Sa2tGX1tB86aaYMIg_MzzEUUPqM8lHhiS2p5UGFbg75IJXTHF-oE6JWJc6CpPGMDjPyDwJQq', rotate: -2, top: '10%', right: '5%' },
    { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZmkt-GnprN5U1x-uwujL1vk3hWaC7U23-rTxShI8R5NW2p6Uz7qw6t8Uxl2hcavH-rQyKSYKKc-2-5siBPfOowCSavKpeLavfw3Gta3HzIJI3vFCrdLmAHKit2bXFcMHKJx2OyQXQM7ucpCoxhz0J1MMWGVMmrmzqoYCxmh0GDaehAjiM4G5bXggRalVAZedeSHiV41AX5hcT8EC4awY74WskFXEyfLu4tI9CTBFV7aTglrYEWgB3M9zMFLMEI6Ry-MANapdTYTrt', rotate: 5, bottom: '10%', left: '10%' },
    { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbmkqUqrwTi6_xIC9m0bNo-QiaXGJ56I8SJlXXA0va5-fcsNc_s3tJ-2ZYbOAaJF1JhpHZKoBauY9khFpga6Uzppkflk74PZKhhvV3CsoquQ4ecpaJQvWQZnu6h9KN62EOabCtjnbEWZIB7ufcSI-giSqloLDTHYbtvyo6D3oxqt8TslIds97ObBeqUhXCs9LwGyOr9aNZ-ru04a7rb6OzYP-FMKDmuB2YkXQLBmpamICZ5x3njEiNv2XrNrFWavD7hQOueb2yYv6I', rotate: -4, bottom: '5%', left: '40%' },
    { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnwvZQMzFhPt2NTuRbETH1cROsallz6iNuxk1P5jWRDMI-heyGmAR6_csUIRmYabRAgaOEBPgBW-wQrbYjSgQIhE7PajECmorj6Ai1Z_7TKK83jKmN4pDNmoj_eZ77dAzclmUhU_p1xU_EDzLdQPoxszy80ZEoHNbHFWcTPHY6G7was_l_RBjz7NA93wOdCAmasJgreHGRgZtnMhv2tw-6iGtAWceKneP60yOqvsbPc1vEyBuwoNc5R4WKKoErhwT8mfeEK4y0fE0S', rotate: 3, bottom: '15%', right: '10%' }
];

const Home: React.FC = () => {
  return (
    <div className={styles.homeContainer}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="max-w-7xl px-6">
          <div className={styles.heroGrid}>
            <SectionReveal direction="right">
              <h1 className={styles.heroTitle}>
                你好，<br />
                我是<span>焦朋友</span>
              </h1>
              <p className={styles.heroDesc}>
                一个不太靠谱的程序猿。一直在尝试重构人生，结果发现最稳定的状态竟然是“凑合着活”。
              </p>
              <div className={styles.heroActions}>
                <button className="btn-primary">开始探索</button>
              </div>
            </SectionReveal>

            <SectionReveal direction="left" delay={0.2} className={styles.sculptureWrapper}>
              <div className={styles.liquidSculpture} />
              <div className={styles.glowOrb} />
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Recent Musings */}
      <section className={styles.musings}>
        <div className="max-w-7xl px-6">
          <SectionReveal>
            <h2 className={styles.sectionTitle}>Recent Musings</h2>
            <p className={styles.sectionSubtitle}>A deep dive into the intersection of code and aesthetics.</p>
          </SectionReveal>

          <div className={styles.musingsList}>
            {ARTICLES.map((article, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <ArtisticCard className={styles.articleCard}>
                  <div className={styles.articleImage}>
                    <img src={article.image} alt={article.title} />
                  </div>
                  <div className={styles.articleContent}>
                    <div className={styles.articleMeta}>
                      <span>{article.category}</span>
                      <span className={styles.dot}>•</span>
                      <span>{article.date}</span>
                    </div>
                    <h3 className={styles.articleTitle}>{article.title}</h3>
                    <p className={styles.articleDescText}>{article.desc}</p>
                    <div className={styles.tags}>
                      {article.tags.map(tag => <span key={tag}>{tag}</span>)}
                    </div>
                  </div>
                </ArtisticCard>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Grid */}
      <section className={styles.curatedGrid}>
        <div className="max-w-7xl px-6">
          <SectionReveal className={styles.gridHeader}>
              <h2 className={styles.sectionTitle}>The Curated Grid</h2>
              <p className={styles.sectionSubtitle}>A structural perspective on creative exploration.</p>
          </SectionReveal>

          <div className={styles.gridContent}>
              {GRID_ITEMS.map((item, i) => (
                  <SectionReveal key={i} delay={i * 0.15}>
                      <ArtisticCard className={styles.gridCard}>
                          <div className={styles.gridImage}>
                              <img src={item.image} alt={item.title} />
                          </div>
                          <div className={styles.gridInfo}>
                             <span className={styles.gridCategory}>{item.category}</span>
                             <h4 className={styles.gridTitle}>{item.title}</h4>
                             <p className={styles.gridDesc}>{item.desc}</p>
                             <span className={styles.gridTags}>{item.tags}</span>
                          </div>
                      </ArtisticCard>
                  </SectionReveal>
              ))}
          </div>
        </div>
      </section>

      {/* Visual Journal (Photo Wall) */}
      <section className={styles.visualJournal}>
          <div className={styles.journalHeader}>
              <h2 className={styles.sectionTitle}>Visual Journal</h2>
              <p className={styles.sectionSubtitle}>Snapshots of life outside the screen.</p>
          </div>
          
          <div className={styles.photoWallContainer}>
              <div className={styles.albumTitle}>MY ALBUM</div>
              {PHOTOS.map((photo, i) => (
                  <SectionReveal 
                    key={i} 
                    className={styles.photoPrint} 
                    style={{ 
                        transform: `rotate(${photo.rotate}deg)`, 
                        top: photo.top, 
                        left: photo.left || 'auto', 
                        right: photo.right || 'auto', 
                        bottom: photo.bottom || 'auto',
                        position: 'absolute'
                    } as React.CSSProperties}
                  >
                      <img src={photo.url} alt={`Snap ${i}`} />
                  </SectionReveal>
              ))}
          </div>
      </section>
    </div>
  );
};

export default Home;
