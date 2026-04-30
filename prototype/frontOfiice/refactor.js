const fs = require('fs');

function refactorFile() {
  let code = fs.readFileSync('/src/app/components/MyInfoPage.tsx', 'utf8');

  // We will define a node script that uses string replacement to:
  // 1. Delete the Seção BPIG-II block entirely from the Desktop section.
  // 2. Insert it before Documentos Gerais.
  // 3. Inject it into Mobile before Documentos Gerais.
  
  const bpigDesktopStart = '              {/* Seção BPIG-II */}';
  const bpigDesktopEnd = '            {/* Mobile Cards */}';
  
  const bStartIdx = code.indexOf(bpigDesktopStart);
  if (bStartIdx === -1) {
    console.log("BPIG section not found");
    return;
  }
  
  // Find the exact end of the BPIG block
  const bEndIdx = code.indexOf(bpigDesktopEnd);
  
  // Wait, there are closing divs before {/* Mobile Cards */}
  // The BPIG block is inside the Desktop Cards div.
  // Let's find the closing of Seção BPIG-II.
  const block = code.substring(bStartIdx, bEndIdx);
  
  // Extract just the BPIG mapping block, without the "Seção BPIG-II" title which we already added manually at the top!
  const bpigMapStart = block.indexOf('{bpigIIDocuments.map((doc) => {');
  // We need to match braces to find the end of the map.
  // But we know it ends right before the closing divs:
  //               })}
  //                 </div>
  //               </div>
  const bpigMapEndStr = '              })}\n                </div>\n              </div>';
  const bpigMapEndIdx = block.indexOf(bpigMapEndStr) + '              })}\n'.length;
  
  const bpigMapCode = block.substring(bpigMapStart, bpigMapEndIdx);
  
  // Now we remove the entire Seção BPIG-II from its current location
  // We will cut from bpigDesktopStart to the end of the block (which is bpigMapEndIdx inside `block`, plus the closing divs)
  const fullBpigBlockToRemove = block.substring(0, block.indexOf('</div>\n              </div>') + '</div>\n              </div>'.length);
  
  code = code.replace(fullBpigBlockToRemove, '');
  
  // Now, we inject bpigMapCode BEFORE generalDocuments.map in the Desktop section.
  const desktopGenStart = '{/* Documentos Gerais */}';
  // Wait, we need the title for General Docs? The user didn't ask for one, but we should separate them.
  const injectedDesktop = `
              {/* BPIG-I Documents */}
              <div className="space-y-4 mb-8">
                ${bpigMapCode}
              </div>
              
              <div className="my-8" style={{ borderTop: '2px solid var(--border)' }} />
              
              ${desktopGenStart}`;
              
  code = code.replace(desktopGenStart, injectedDesktop);
  
  // Now for Mobile:
  // We need to generate a mobile version of bpigMapCode.
  // We can just use the Desktop map code, but it has Desktop-specific grid classes.
  // Wait, we can just replace 'bpigIIDocuments' with 'orderedDocuments' and handle the title!
  
  fs.writeFileSync('/src/app/components/MyInfoPage.tsx', code);
  console.log("Refactoring part 1 done");
}

refactorFile();
