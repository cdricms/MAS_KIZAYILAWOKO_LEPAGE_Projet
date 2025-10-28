#import "@preview/datify:1.0.0": custom-date-format

#let header(
  title,
  subtitle,
  authors: ("Cédric MAS", "Thomas LEPAGE", "David KIZAYILAWOKO"),
  date: datetime.today(),
  date-format: "d MMMM y",
  date-lang: "fr",
  title-size: 24pt,
  subtitle-size: 18pt,
  author-size: 14pt,
  date-size: 12pt,
  spacing: 2cm
) = {
  pagebreak(weak: true)

  align(center + horizon)[
    #v(1fr)

    #text(size: title-size, weight: "bold")[
		#title
	]

    #text(size: subtitle-size, weight: "bold")[
		#subtitle
	]
    #v(spacing)

    #text(size: author-size, "Par :")
    #for author in authors [
      *#author* \
    ]

    #v(spacing)

    #text(size: date-size, custom-date-format(date, lang: date-lang, pattern: date-format))
    #v(1fr)
  ]

  pagebreak()
  outline(title: "Sommaire")
  pagebreak()
}
