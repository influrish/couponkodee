import {
  HeaderData,
  FooterData,
  SiteSettingsData,
  PageData,
  HeroBannerItem,
  defaultHeaderData,
  defaultFooterData,
  defaultSiteSettingsData,
} from "./cms-types"

export type { HeaderData, FooterData, SiteSettingsData, PageData, HeroBannerItem }
export { defaultHeaderData, defaultFooterData, defaultSiteSettingsData }


export async function getHeaderData(): Promise<HeaderData> {
  try {
    const { getPayloadClient } = await import("@/src/lib/payload")
    const payload = await getPayloadClient()
    const globalData = await payload.findGlobal({
      slug: "header",
    })

    if (globalData) {
      return {
        brand: {
          brandName: globalData.brand?.brandName || defaultHeaderData.brand.brandName,
          brandHighlight: globalData.brand?.brandHighlight || defaultHeaderData.brand.brandHighlight,
          customLogoUrl: globalData.brand?.customLogoUrl || undefined,
        },
        appearance: {
          navbarBg: globalData.appearance?.navbarBg || defaultHeaderData.appearance?.navbarBg,
          customBgColor: globalData.appearance?.customBgColor || undefined,
          accentColor: globalData.appearance?.accentColor || defaultHeaderData.appearance?.accentColor,
          customAccentColor: globalData.appearance?.customAccentColor || undefined,
          announcementBg: globalData.appearance?.announcementBg || defaultHeaderData.appearance?.announcementBg,
          customAnnouncementBg: globalData.appearance?.customAnnouncementBg || undefined,
          customAnnouncementTextColor: globalData.appearance?.customAnnouncementTextColor || undefined,
        },
        announcement: {
          enabled: Boolean(globalData.announcement?.enabled),
          text: globalData.announcement?.text || defaultHeaderData.announcement.text,
          link: globalData.announcement?.link || defaultHeaderData.announcement.link,
          badge: globalData.announcement?.badge || defaultHeaderData.announcement.badge,
        },
        search: {
          placeholder: globalData.search?.placeholder || defaultHeaderData.search.placeholder,
          buttonText: globalData.search?.buttonText || defaultHeaderData.search.buttonText,
        },
        menuItems: Array.isArray(globalData.menuItems) && globalData.menuItems.length > 0
          ? globalData.menuItems.map((item: any) => ({
              label: item.label,
              url: item.url,
              badge: item.badge || undefined,
              isCashback: Boolean(item.isCashback),
              openInNewTab: Boolean(item.openInNewTab),
            }))
          : defaultHeaderData.menuItems,
        features: {
          showCountrySelector: globalData.features?.showCountrySelector ?? true,
          showSearch: globalData.features?.showSearch ?? true,
          loginLabel: globalData.features?.loginLabel || defaultHeaderData.features.loginLabel,
          signupLabel: globalData.features?.signupLabel || defaultHeaderData.features.signupLabel,
        },
      }
    }
  } catch (err) {
    console.warn("Unable to fetch header global from Payload, using default:", err)
  }

  return defaultHeaderData
}

export async function getFooterData(): Promise<FooterData> {
  try {
    const { getPayloadClient } = await import("@/src/lib/payload")
    const payload = await getPayloadClient()
    const globalData = await payload.findGlobal({
      slug: "footer",
    })

    if (globalData) {
      return {
        brand: {
          aboutTitle: globalData.brand?.aboutTitle || defaultFooterData.brand.aboutTitle,
          brandName: globalData.brand?.brandName || defaultFooterData.brand.brandName,
          brandHighlight: globalData.brand?.brandHighlight || defaultFooterData.brand.brandHighlight,
          tagline: globalData.brand?.tagline || defaultFooterData.brand.tagline,
          customLogoUrl: globalData.brand?.customLogoUrl || undefined,
          bio: globalData.brand?.bio || defaultFooterData.brand.bio,
        },
        appearance: {
          themePreset: globalData.appearance?.themePreset || defaultFooterData.appearance?.themePreset,
          customBgColor: globalData.appearance?.customBgColor || undefined,
          customTextColor: globalData.appearance?.customTextColor || undefined,
          accentColor: globalData.appearance?.accentColor || defaultFooterData.appearance?.accentColor,
          customAccentColor: globalData.appearance?.customAccentColor || undefined,
          socialIconStyle: globalData.appearance?.socialIconStyle || defaultFooterData.appearance?.socialIconStyle,
          layoutColumns: globalData.appearance?.layoutColumns || defaultFooterData.appearance?.layoutColumns,
          showSocialLinks: globalData.appearance?.showSocialLinks ?? defaultFooterData.appearance?.showSocialLinks ?? true,
          showCopyrightBar: globalData.appearance?.showCopyrightBar ?? defaultFooterData.appearance?.showCopyrightBar ?? true,
        },
        socialLinks: {
          facebook: globalData.socialLinks?.facebook || defaultFooterData.socialLinks.facebook,
          twitter: globalData.socialLinks?.twitter || defaultFooterData.socialLinks.twitter,
          instagram: globalData.socialLinks?.instagram || defaultFooterData.socialLinks.instagram,
          youtube: globalData.socialLinks?.youtube || defaultFooterData.socialLinks.youtube,
          telegram: globalData.socialLinks?.telegram || defaultFooterData.socialLinks.telegram,
          linkedin: globalData.socialLinks?.linkedin || undefined,
          pinterest: globalData.socialLinks?.pinterest || defaultFooterData.socialLinks.pinterest,
          whatsapp: globalData.socialLinks?.whatsapp || defaultFooterData.socialLinks.whatsapp,
        },
        columns: Array.isArray(globalData.columns) && globalData.columns.length > 0
          ? globalData.columns.map((col: any) => ({
              title: col.title,
              links: Array.isArray(col.links)
                ? col.links.map((link: any) => ({
                    label: link.label,
                    url: link.url,
                    isHighlighted: Boolean(link.isHighlighted),
                    openInNewTab: Boolean(link.openInNewTab),
                  }))
                : [],
            }))
          : defaultFooterData.columns,
        disclosure: {
          showDisclosure: globalData.disclosure?.showDisclosure ?? true,
          title: globalData.disclosure?.title || defaultFooterData.disclosure.title,
          content: globalData.disclosure?.content || defaultFooterData.disclosure.content,
        },
        copyright: {
          text: globalData.copyright?.text || defaultFooterData.copyright.text,
          bottomLinks: Array.isArray(globalData.copyright?.bottomLinks) && globalData.copyright.bottomLinks.length > 0
            ? globalData.copyright.bottomLinks.map((l: any) => ({
                label: l.label,
                url: l.url,
              }))
            : defaultFooterData.copyright.bottomLinks,
        },
      }
    }
  } catch (err) {
    console.warn("Unable to fetch footer global from Payload, using default:", err)
  }

  return defaultFooterData
}

export async function getCashbackVisibility(): Promise<boolean> {
  try {
    const { getPayloadClient } = await import("@/src/lib/payload")
    const payload = await getPayloadClient()
    const globalData = await payload.findGlobal({
      slug: "site-settings",
    })

    if (globalData && (globalData as any).cashbackVisibility === "on") {
      return true
    }
  } catch (err) {
    console.warn("Unable to fetch site-settings global for cashback visibility:", err)
  }

  return false
}

export async function getSiteSettingsData(): Promise<SiteSettingsData> {
  try {
    const { getPayloadClient } = await import("@/src/lib/payload")
    const payload = await getPayloadClient()
    const globalData = await payload.findGlobal({
      slug: "site-settings",
    })

    if (globalData) {
      return {
        cashbackVisibility: (globalData as any).cashbackVisibility === "on" ? "on" : "off",
        appearance: {
          primaryAccent: globalData.appearance?.primaryAccent || defaultSiteSettingsData.appearance?.primaryAccent,
          heroBackgroundStyle: globalData.appearance?.heroBackgroundStyle || defaultSiteSettingsData.appearance?.heroBackgroundStyle,
        },
        hero: {
          kicker: globalData.hero?.kicker || defaultSiteSettingsData.hero.kicker,
          title: globalData.hero?.title || defaultSiteSettingsData.hero.title,
          subtitle: globalData.hero?.subtitle || defaultSiteSettingsData.hero.subtitle,
          badgeText: globalData.hero?.badgeText || defaultSiteSettingsData.hero.badgeText,
          cashbackPillLabel: globalData.hero?.cashbackPillLabel || defaultSiteSettingsData.hero.cashbackPillLabel,
          autoSlideInterval: globalData.hero?.autoSlideInterval ?? defaultSiteSettingsData.hero.autoSlideInterval,
          showOfficialBadge: globalData.hero?.showOfficialBadge ?? defaultSiteSettingsData.hero.showOfficialBadge,
          bannerHoverPause: globalData.hero?.bannerHoverPause ?? defaultSiteSettingsData.hero.bannerHoverPause,
          banners: Array.isArray(globalData.hero?.banners) && globalData.hero.banners.length > 0
            ? globalData.hero.banners.map((b: any) => ({
                storeName: b.storeName,
                title: b.title,
                subtitle: b.subtitle || undefined,
                code: b.code,
                cashbackRate: b.cashbackRate || "Up to 8.5% CB",
                storeRating: b.storeRating || "4.9/5",
                successRate: b.successRate || "98.6%",
                linkUrl: b.linkUrl || undefined,
                countryCode: b.countryCode || undefined,
                bannerImage: b.bannerImage || undefined,
              }))
            : undefined,
        },
        howItWorks: {
          kicker: globalData.howItWorks?.kicker || defaultSiteSettingsData.howItWorks.kicker,
          title: globalData.howItWorks?.title || defaultSiteSettingsData.howItWorks.title,
          subtitle: globalData.howItWorks?.subtitle || defaultSiteSettingsData.howItWorks.subtitle,
          steps: Array.isArray(globalData.howItWorks?.steps) && globalData.howItWorks.steps.length > 0
            ? globalData.howItWorks.steps.map((st: any) => ({
                stepNumber: st.stepNumber,
                title: st.title,
                description: st.description,
              }))
            : defaultSiteSettingsData.howItWorks.steps,
        },
        faqs: {
          title: globalData.faqs?.title || defaultSiteSettingsData.faqs.title,
          subtitle: globalData.faqs?.subtitle || defaultSiteSettingsData.faqs.subtitle,
          items: Array.isArray(globalData.faqs?.items) && globalData.faqs.items.length > 0
            ? globalData.faqs.items.map((it: any) => ({
                q: it.q || it.question,
                a: it.a || it.answer,
              }))
            : defaultSiteSettingsData.faqs.items,
        },
        newsletter: {
          heading: globalData.newsletter?.heading || defaultSiteSettingsData.newsletter.heading,
          subtitle: globalData.newsletter?.subtitle || defaultSiteSettingsData.newsletter.subtitle,
          buttonText: globalData.newsletter?.buttonText || defaultSiteSettingsData.newsletter.buttonText,
        },
        contact: {
          supportEmail: globalData.contact?.supportEmail || defaultSiteSettingsData.contact.supportEmail,
          partnershipsEmail: globalData.contact?.partnershipsEmail || defaultSiteSettingsData.contact.partnershipsEmail,
          supportPhone: globalData.contact?.supportPhone || defaultSiteSettingsData.contact.supportPhone,
          address: globalData.contact?.address || defaultSiteSettingsData.contact.address,
        },
      }
    }
  } catch (err) {
    console.warn("Unable to fetch site-settings global from Payload, using default:", err)
  }

  return defaultSiteSettingsData
}

export async function getCmsPage(slug: string): Promise<PageData | null> {
  try {
    const { getPayloadClient } = await import("@/src/lib/payload")
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: "pages",
      where: {
        and: [
          { slug: { equals: slug } },
          { isPublished: { equals: true } },
        ],
      },
      limit: 1,
    })

    if (result.docs.length > 0) {
      const doc: any = result.docs[0]
      return {
        title: doc.title,
        slug: doc.slug,
        subtitle: doc.subtitle || undefined,
        body: doc.body || "",
        metaTitle: doc.metaTitle || undefined,
        metaDescription: doc.metaDescription || undefined,
      }
    }
  } catch (err) {
    console.warn(`Unable to fetch CMS page for slug "${slug}":`, err)
  }

  return null
}

