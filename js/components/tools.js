const toolsSectionElement = document.getElementById('toolsSection');

export function renderToolsSection(tools) {
    const toolsHTML = `
        <h3 class="tools-section__title">Tools</h3>
        <div class="grid-container-4">
            ${tools.map(tool => {
                if (tool.link) {
                    return `
                        <a href="${tool.link}" class="card tool-card tool-card--${tool.color}">
                            <i class="${tool.icon}"></i> ${tool.text}
                        </a>
                    `;
                } else {
                    return `
                        <div class="card tool-card tool-card--${tool.color}">
                            <i class="${tool.icon}"></i> ${tool.text}
                        </div>
                    `;
                }
            }).join('')}
        </div>
    `;
    toolsSectionElement.innerHTML = toolsHTML;
}