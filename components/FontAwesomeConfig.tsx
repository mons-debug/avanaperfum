'use client';

import { useEffect } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faShoppingBag, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';

// Prevent Font Awesome from adding its CSS since we did it manually above
config.autoAddCss = false;

// Initialize the library with icons we'll use
export function initFontAwesome() {
  library.add(
    faSearch,
    faShoppingBag, 
    faBars,
    faTimes
  );
}

export default function FontAwesomeConfig() {
  useEffect(() => {
    initFontAwesome();
  }, []);

  return null;
}
