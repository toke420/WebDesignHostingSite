/** Shared nav renderer: marks the current page for screen readers and styling. */
export function navLinks(links, file) {
  return links
    .map(
      ([href, label]) =>
        `<a href="${href}"${href === file ? ' aria-current="page"' : ""}>${label}</a>`,
    )
    .join("");
}
