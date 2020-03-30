import React from 'react';
import Layout from '../layout/Layout';
import Typography from '@material-ui/core/Typography';

import Head from './components/Head';
import TextContents from './components/TextContents'

const PrivacyCookies = (props) => {

  return (
    <Layout>

      <Head
        title="Privacy and cookies"

      />

      <TextContents>


        <Typography gutterBottom variant="h3">Disclaimer </Typography>
        <Typography paragraph variant="body1" component="p">
          The information contained in this website is for general information purposes only. The information is provided by the NTD Modelling Consortium. While we strive to keep the information up-to-date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website or the information, products, services or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk.
        </Typography>
        <Typography paragraph variant="body1" component="p">
          In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from, or in connection with, the use of this website.
        </Typography>
        <Typography gutterBottom variant="h3"><br />Cookie policy </Typography>
        <Typography paragraph variant="body1" component="p">
          We use both session cookies and persistent cookies on the website.
        </Typography>
        <Typography gutterBottom variant="h3"><br />How we use cookies </Typography>
        <Typography paragraph variant="body1" component="p">
          Cookies do not contain any information that personally identifies you, but personal information that we store about you may be linked, by us, to the information stored in and obtained from cookies. The cookies used on the website include those which are strictly necessary cookies for access and navigation, cookies that track usage (performance cookies), remember your choices (functionality cookies), and cookies that provide you with targeted content or advertising.
        </Typography>
        <Typography paragraph variant="body1" component="p">
          We may use the information we obtain from your use of our cookies for the following purposes:<br />
	          to recognise your computer when you visit the website<br />
	          to track you as you navigate the website, and to enable the use of any e-commerce facilities<br />
	          to improve the website's usability<br />
	          to analyse the use of the website<br />
	          in the administration of the website<br />
        </Typography>
        <Typography paragraph variant="body1" component="p">
          For more information on managing advertising personalisation through your Google account please <a href="https://support.google.com/ads/answer/2662922?hl=en-GB">visit this page</a>.
        </Typography>
        <Typography gutterBottom variant="h3"><br />Third-party cookies</Typography>
        <Typography paragraph variant="body1" component="p">
          When you use the website, you may also be sent third party cookies. 
          </Typography>
        <Typography paragraph variant="body1" component="p">
          Our service providers may send you cookies. They may use the information they obtain from your use of their cookies:<br />
              to track your browser across multiple websites<br />
              to build a profile of your web surfing<br />
        </Typography>
        <Typography paragraph variant="body1" component="p">
          In addition to the information we provide in this Cookie Policy, you can find out more information about your online choices at http://www.youronlinechoices.com/uk/opt-out-help
        </Typography>
        <Typography gutterBottom variant="h3"><br />Blocking cookies</Typography>
        <Typography paragraph variant="body1" component="p">
 
Most browsers allow you to refuse to accept cookies. For example: 
<br />in Internet Explorer you can refuse all cookies by clicking "Tools", "Internet Options", "Privacy", and selecting "Block all cookies" using the sliding selector;
<br />in Firefox you can block all cookies by clicking "Tools", "Options", and un-checking "Accept cookies from sites" in the "Privacy" box.
<br />	in Google Chrome you can adjust your cookie permissions by clicking "Options", "Under the hood", Content Settings in the "Privacy" section. Click on the Cookies tab in the Content Settings.
<br />	in Safari you can block cookies by clicking “Preferences”, selecting the “Privacy” tab and “Block cookies”.
  </Typography>
        <Typography paragraph variant="body1" component="p">
          Blocking all cookies will, however, have a negative impact upon the usability of many websites. If you block cookies, you may not be able to use certain features on the website.
        </Typography>
        <Typography gutterBottom variant="h3"><br />Deleting cookies</Typography>
        <Typography paragraph variant="body1" component="p">
        You can also delete cookies already stored on your computer:
        <br />	in Internet Explorer, you must manually delete cookie files;
        <br />	in Firefox, you can delete cookies by, first ensuring that cookies are to be deleted when you "clear private data" (this setting can be changed by clicking "Tools", "Options" and "Settings" in the "Private Data" box) and then clicking "Clear private data" in the "Tools" menu.
        <br />	in Google Chrome you can adjust your cookie permissions by clicking "Options", "Under the hood", Content Settings in the "Privacy" section. Click on the Cookies tab in the Content Settings.
        <br /> 	in Safari you can delete cookies by clicking “Preferences”, selecting the “Privacy” tab and “Remove All Website Data”.
        </Typography>
        <Typography paragraph variant="body1" component="p">
           Obviously, doing this may have a negative impact on the usability of many websites.
          </Typography>
        <Typography gutterBottom variant="h3"><br />Contact Us</Typography>
        <Typography paragraph variant="body1" component="p">


We welcome feedback about our website and about the work of the NTD Modelling Consortium. Please contact us for more information.
<br /><a href="javascript:location='mailto:\u0064\u0065\u0069\u0072\u0064\u0072\u0065\u002e\u0068\u006f\u006c\u006c\u0069\u006e\u0067\u0073\u0077\u006f\u0072\u0074\u0068\u0040\u0062\u0064\u0069\u002e\u006f\u0078\u002e\u0061\u0063\u002e\u0075\u006b';void 0">Professor Déirdre Hollingsworth</a><br />
          University of Oxford<br />
          <br />
          <a href="javascript:location='mailto:\u0062\u0065\u0074\u0068\u002e\u0062\u0072\u0075\u0063\u0065\u0040\u0062\u0064\u0069\u002e\u006f\u0078\u002e\u0061\u0063\u002e\u0075\u006b';void 0">Beth Bruce</a><br />
          University of Oxford<br />
<br />Big Data Institute
<br />University of Oxford
<br />Old Road Campus
<br />Headington
<br />Oxford
<br />OX3 7LF
        </Typography>


      </TextContents>
    </Layout>
  )
}
export default PrivacyCookies;
