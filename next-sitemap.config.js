/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://pointme.co.za',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/admin/*', '/business/dashboard/*', '/dashboard/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/business/dashboard/', '/dashboard/', '/api/'],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://pointme.co.za'}/sitemap.xml`,
    ],
  },
  transform: async (config, path) => {
    // Custom transform for different page types
    const customConfig = {
      loc: path,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }

    // Homepage gets highest priority
    if (path === '/') {
      customConfig.priority = 1.0
      customConfig.changefreq = 'daily'
    }

    // Business and service pages get high priority
    if (path.startsWith('/business/') || path.startsWith('/services/')) {
      customConfig.priority = 0.9
      customConfig.changefreq = 'weekly'
    }

    // Auth pages get lower priority
    if (path.startsWith('/auth/')) {
      customConfig.priority = 0.3
      customConfig.changefreq = 'monthly'
    }

    return customConfig
  },
}

