const fs = require('fs');

function modifyFile() {
  const code = fs.readFileSync('/src/app/components/MyInfoPage.tsx', 'utf8');

  // Find boundaries
  const desktopGenStart = code.indexOf('{/* Documentos Gerais */}');
  const bpigStart = code.indexOf('{/* Seção BPIG-II */}');
  const bpigEnd = code.indexOf('</div>\n              </div>\n            </div>\n\n            {/* Mobile Cards */}');
  
  if (desktopGenStart === -1 || bpigStart === -1 || bpigEnd === -1) {
    console.error('Could not find markers');
    return;
  }

  // Extract blocks
  // The Desktop General block goes from desktopGenStart to bpigStart
  const desktopGenBlock = code.substring(desktopGenStart, bpigStart);
  
  // The BPIG block goes from bpigStart to the end of its div
  const bpigBlock = code.substring(bpigStart, bpigEnd);

  // Reorder for Desktop: BPIG first, then General
  // Wait, we want BPIG right below the newly added title block, which is right BEFORE {/* Desktop Cards */}
  // Actually, we can just replace the whole Desktop Cards interior.
  
  // What about Mobile?
  const mobileStart = code.indexOf('{/* Documentos Gerais */}', bpigEnd);
  const mobileEndBlock = code.indexOf('</section>');
  
  const mobileGenBlock = code.substring(mobileStart, mobileEndBlock);
  
  // To keep things simple, let's just make the BPIG block work for Mobile too!
  // We can adapt the BPIG Desktop block to be fully responsive, or we can just duplicate the mobileGenBlock structure 
  // and use it for BPIG Mobile. 
  // Since BPIG has special CNIS logic (isReprovado), we'd need to copy that CNIS logic.
  
  console.log('Found all markers successfully.');
}

modifyFile();
