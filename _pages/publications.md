---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
hide_archive_title: true
# published: false
---

{% if author.googlescholar %}
  <p class="publication-index__scholar">You can also find my articles on <a href="{{author.googlescholar}}" target="_blank" rel="noopener noreferrer">Google Scholar <span aria-hidden="true">↗</span></a>.</p>
{% endif %}

{% include base_path %}
{% assign publications_by_date = site.publications | sort: "date" | reverse %}

<section class="publication-index" data-publication-index aria-labelledby="publication-index-title">
  <div class="publication-index__intro">
    <p class="eyebrow">Research archive</p>
    <h2 id="publication-index-title">Publications</h2>
    <p>Titles open the linked preprint or paper. Hover a row for a quick abstract preview, or use the Abstract control on touch and keyboard devices.</p>
  </div>

  <div class="publication-index__tools">
    <label class="sr-only" for="publication-search">Search publications</label>
    <input id="publication-search" class="publication-search" type="search" placeholder="Search title, author, or venue" data-publication-search>
    <div class="publication-filters" role="group" aria-label="Filter publications by year">
      <button class="publication-filter is-active" type="button" data-publication-filter="all" aria-pressed="true">All</button>
      {% assign publication_years = "" %}
      {% for post in publications_by_date %}
        {% assign year = post.date | date: "%Y" %}
        {% unless publication_years contains year %}
          <button class="publication-filter" type="button" data-publication-filter="{{ year }}" aria-pressed="false">{{ year }}</button>
          {% assign publication_years = publication_years | append: year | append: "," %}
        {% endunless %}
      {% endfor %}
    </div>
  </div>

  <div class="publication-index__list">
    {% for post in publications_by_date %}
      {% include publication-item.html post=post %}
    {% endfor %}
  </div>
  <p class="publication-index__empty" data-publication-empty hidden>No publications match that search.</p>
</section>
