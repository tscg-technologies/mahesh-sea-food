/**
 * Mahesh Seafood Traders - Product Details Controller (product-details.js)
 * Dynamically renders product specifications, related products, or 404 state.
 */

document.addEventListener('DOMContentLoaded', () => {
  initProductDetailsPage();
});

function initProductDetailsPage() {
  const container = document.getElementById('productDetailsContainer');
  const notFoundContainer = document.getElementById('productNotFoundContainer');
  const relatedGrid = document.getElementById('relatedProductsGrid');

  if (!container || typeof SEAFOOD_PRODUCTS === 'undefined') return;

  // Extract ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  const product = productId ? SEAFOOD_PRODUCTS.find(p => p.id === productId) : null;

  if (!product) {
    // Show 404 Not Found block
    container.style.display = 'none';
    if (notFoundContainer) {
      notFoundContainer.style.display = 'block';
      const idSpan = document.getElementById('missingProductId');
      if (idSpan) idSpan.textContent = productId ? `"${productId}"` : '(None specified)';
    }
    return;
  }

  // Update page title
  document.title = `${product.name} | Mahesh Sea Foods`;

  // Update Breadcrumb
  const breadcrumbProduct = document.getElementById('breadcrumbProduct');
  const breadcrumbCategory = document.getElementById('breadcrumbCategory');
  if (breadcrumbProduct) breadcrumbProduct.textContent = product.name;
  if (breadcrumbCategory) {
    breadcrumbCategory.textContent = product.categoryName;
    breadcrumbCategory.href = `products.html?category=${encodeURIComponent(product.category)}`;
  }

  // Populate Product Information
  const imgEl = document.getElementById('detailImage');
  const categoryTag = document.getElementById('detailCategoryTag');
  const titleEl = document.getElementById('detailTitle');
  const shortDescEl = document.getElementById('detailShortDesc');
  const fullDescEl = document.getElementById('detailFullDesc');
  const unitEl = document.getElementById('detailUnit');
  const sizesEl = document.getElementById('detailSizes');
  const cutsEl = document.getElementById('detailCuts');
  const gradeEl = document.getElementById('detailGrade');
  const packagingEl = document.getElementById('detailPackaging');
  const waBtn = document.getElementById('detailWaBtn');
  const contactBtn = document.getElementById('detailContactBtn');

  if (imgEl) {
    imgEl.src = product.image;
    imgEl.alt = product.name;
  }
  if (categoryTag) {
    categoryTag.textContent = product.categoryName;
    categoryTag.href = `products.html?category=${encodeURIComponent(product.category)}`;
  }
  if (titleEl) titleEl.textContent = product.name;
  if (shortDescEl) shortDescEl.textContent = product.shortDescription;
  if (fullDescEl) fullDescEl.textContent = product.fullDescription;
  if (unitEl) unitEl.textContent = product.unit;
  if (sizesEl) sizesEl.textContent = product.commercialSizes || 'Standard daily sizes';
  if (cutsEl) cutsEl.textContent = product.cutOptions || 'Whole Round, Steaks, Cleaned';
  if (gradeEl) gradeEl.textContent = product.freshnessGrade || 'Daily Landing / Chilled Catch';
  if (packagingEl) packagingEl.textContent = product.packaging || 'Insulated Crushed Ice Boxes';

  // Configure WhatsApp CTA
  if (waBtn) {
    const waMsg = `Hello Mahesh Sea Foods, I would like to enquire about ${product.name} (${product.unit}). Please confirm availability, fresh batch timing, and rates.`;
    waBtn.href = getWhatsAppUrl(waMsg);
    waBtn.target = '_blank';
    waBtn.rel = 'noopener noreferrer';
  }

  // Configure Contact form CTA
  if (contactBtn) {
    contactBtn.href = `contact.html?product=${encodeURIComponent(product.id)}`;
  }

  // Render Related Products (same category or nearby items)
  if (relatedGrid) {
    const related = CatalogService.getRelatedProducts(product.id, 3);
    relatedGrid.innerHTML = related.map(p => {
      const waMsg = `Hello Mahesh Sea Foods, I would like to enquire about ${p.name}.`;
      const waUrl = getWhatsAppUrl(waMsg);
      return `
        <article class="product-card">
          <div class="product-img-wrap">
            <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy">
            <span class="product-category-tag">${escapeHtml(p.categoryName)}</span>
          </div>
          <div class="product-card-body">
            <h3 class="product-title">${escapeHtml(p.name)}</h3>
            <p class="product-desc">${escapeHtml(p.shortDescription)}</p>
            <div class="product-specs-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              <span>${escapeHtml(p.unit)}</span>
            </div>
            <div class="product-actions">
              <a href="product-details.html?id=${encodeURIComponent(p.id)}" class="btn btn-sm btn-outline">View Details</a>
              <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-whatsapp">WhatsApp</a>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }
}
