export const htmlEmailFormat = ({
  actionLink,
  frontendUrl,
  title,
  logoUrl = '',
  actionText,
  description,
  highlightedText,
  baseTitle = 'Gahigi AI',
}: {
  frontendUrl?: string;
  baseTitle?: string;
  title?: string;
  actionLink?: string;
  actionText?: string;
  logoUrl?: string;
  description?: string;
  highlightedText?: string;
}) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
  <html lang="en">
  
    <head></head>
    <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">${title}<div></div>
    </div>
  
    <body style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif">
      <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:37.5em;margin:0 auto;padding:20px 0 48px;width:560px">
        <tr style="width:100%">
          <td><img alt="${baseTitle}" src="${logoUrl}" width="42" height="42" style="display:block;outline:none;border:none;text-decoration:none;border-radius:21px;width:42px;height:42px" />
            ${
              !!title
                ? '<h1 style="font-size:24px;letter-spacing:-0.5px;line-height:1.3;font-weight:400;color:#234199;padding:17px 0 0">' +
                  title +
                  '</h1>'
                : ''
            }
            <table style="padding:27px 0 27px" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
              <tbody>
                <tr>
                <td>${
                  !!actionLink
                    ? '<a href="' +
                      actionLink +
                      '" target="_blank" style="background-color:#5e6ad2;border-radius:3px;font-weight:600;color:#fff;font-size:15px;text-decoration:none;text-align:center;display:inline-block;p-x:23px;p-y:11px;line-height:100%;max-width:100%;padding:11px 23px"><span><!--[if mso]><i style="letter-spacing: 23px;mso-font-width:-100%;mso-text-raise:16.5" hidden>&nbsp;</i><![endif]--></span><span style="background-color:#5e6ad2;border-radius:3px;font-weight:600;color:#fff;font-size:15px;text-decoration:none;text-align:center;display:inline-block;p-x:23px;p-y:11px;max-width:100%;line-height:120%;text-transform:none;mso-padding-alt:0px;mso-text-raise:8.25px">' +
                      actionText +
                      '</span><span><!--[if mso]><i style="letter-spacing: 23px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a>}'
                    : ''
                }
                  </td>
                </tr>
              </tbody>
            </table>
            ${
              !!description
                ? '<p style="font-size:15px;line-height:1.4;margin:0 0 15px;color:#3c4149">' +
                  description +
                  '</p>'
                : null
            }
            
            ${
              !!highlightedText
                ? '<code style="font-family:monospace;font-weight:700;padding:1px 4px;background-color:#dfe1e4;letter-spacing:-0.3px;font-size:21px;border-radius:4px;color:#3c4149">' +
                  highlightedText +
                  '</?code>'
                : ''
            }
            <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#dfe1e4;margin:42px 0 26px" />
            ${
              !!frontendUrl
                ? '<a target="_blank" style="color:#234199;text-decoration:none;font-size:24px" href="' +
                  frontendUrl +
                  '">' +
                  baseTitle +
                  '</a>'
                : ''
            }
          </td>
        </tr>
      </table>
    </body>
  
  </html>
  `;
