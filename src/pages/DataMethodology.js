import React from 'react';
import Layout from '../layout/Layout';
import Typography from '@material-ui/core/Typography';

import Head from './components/Head';
import TextContents from './components/TextContents'

const DataMethodology = (props) => {

  return (
    <Layout>

      <Head
        title="Data & Methodology 
        "

      />

      <TextContents>

        <Typography paragraph variant="body1" component="p">
        Lymphatic filariasis is due to filarial parasites which are transmitted to humans through mosquitoes. 
        </Typography>
        <Typography paragraph variant="body1" component="p">
        When a mosquito with infective stage larvae bites a person, the parasites are deposited on the person's skin from where they enter the body. The larvae then migrate to the lymphatic vessels where they develop into adult worms in the human lymphatic system. Infection is usually acquired in childhood, but the painful and profoundly disfiguring visible manifestations of the disease occur later in life. Whereas acute episodes of the disease cause temporary disability, lymphatic filariasis (LF) leads to permanent disability.
        </Typography>
        <Typography gutterBottom variant="h3"><br />Disease Burden</Typography>
        <Typography paragraph variant="body1" component="p">    
          LF is endemic in 83 countries and there are an estimated 120 million cases, including 25 million men with hydroceles and 15 million people, primarily women, with lymphedema. The disease occurs throughout the tropical areas of Africa, Asia, the Americas and the Pacific, with around 66% of the infection clustered in South-East Asia and most of the remaining infection (~33%) centered in Africa.
        </Typography>
        <Typography gutterBottom variant="h3"><br />Transmission Dynamics</Typography>
        <Typography paragraph variant="body1" component="p">
          LF is caused by a species of filarial round worms, or nematodes, with up to 90% of all infections caused by Wuchereria bancrofti. In some parts of Asia, LF is caused by Brugia malayi and Brugia timori.  Various mosquito species transmit these worms: Culex mosquitoes transmit W. bancrofti in urban and semi-urban areas, Anopheles mosquitoes transmit worms in rural environments, especially in Africa, and Aedes mosquitoes are responsible for transmission throughout the Pacific.
          </Typography>
        <Typography paragraph variant="body1" component="p">
          To learn more about the transmission dynamics of lymphatic filariasis, please visit the <a href="http://www.thiswormyworld.org/about-worms/worms/what-are-worms">Global Atlas of Helminth Infections (GAHI)</a>.
        </Typography>
        <Typography gutterBottom variant="h3"><br />Interventions</Typography>
        <Typography paragraph variant="body1" component="p">
          Numerous countries have implemented LF control programmes, with significant achievements in the Americas, the Pacific and Asia. A few countries in Africa are close to their elimination goals. To learn more about LF elimination, please visit the <a href="http://www.thiswormyworld.org/about-worms/elimination-of-lymphatic-filariasis">Global Atlas of Helminth Infections</a>.
        </Typography>
        <Typography gutterBottom variant="h3"><br />Simulation Model</Typography>
        <Typography paragraph variant="body1" component="p">
          The underlying model is stochastic and individual-based. Its description includes an individual's worm burden, mf burden as well as aspects of the transmission cycle in mosquito populations. Various interventions are also modelled on the population. The main intervention is mass drug administration (MDA), where different regimens can be selected. Interventions also include vector control including bed-nets and insecticide treatment. A full model description can be found in the accompanying <a href="https://parasitesandvectors.biomedcentral.com/articles/10.1186/s13071-015-1152-3">P&V paper</a>, which can be found in the further reading section. Please note that the model has only been validated against a certain number of settings, details of which can be found in the <a href="https://parasitesandvectors.biomedcentral.com/articles/10.1186/s13071-015-1152-3">paper</a>.
          </Typography>
        <Typography gutterBottom variant="h3"><br />Model code</Typography>
        <Typography paragraph variant="body1" component="p">
          We are committed to making our model code available for use by other modellers. Below are links to code used in recent publications:
        </Typography>
        <Typography paragraph variant="body1" component="p">
          Smith et al. <a href="https://doi.org/10.1016/j.epidem.2017.02.006">Predicting lymphatic filariasis transmission and elimination dynamics using a multi-model ensemble framework</a> Epidemics 2017. The <a href="https://www.ntdmodelling.org/sites/www.ntdmodelling.org/files/content/EPIFIL_Code%202.zip">code for EPIFIL is available here</a>. The <a href="https://github.com/sempwn/LF-model">code for TRANSFIL is available here</a>. The code for LYMFASIM was published with:
        </Typography>
        <Typography paragraph variant="body1" component="p">
          Jambulingam et al. <a href="https://parasitesandvectors.biomedcentral.com/articles/10.1186/s13071-016-1768-y">Mathematical modelling of lymphatic filariasis elimination programmes in India: required duration of mass drug administration and post-treatment level of infection indicators</a>. Parasites and Vectors 2016. The code is in the additional files at the end of the paper.
        </Typography>
        <Typography gutterBottom variant="h3"><br />Further Reading</Typography>
        <Typography paragraph variant="body1" component="p">
          <a href="https://parasitesandvectors.biomedcentral.com/articles/10.1186/s13071-015-1152-3">Modelling paper</a><br />
          Provides an overview of the accompanying model as well as the underlying parameters. 
          <br />
          <br />
          <a href="http://dx.doi.org/10.1371/journal.pntd.0005206">Accompanying paper</a><br />
          Provides a description and motivation behind this tool.<br />
          <br />
          Useful links<br />
          <a href="http://www.thiswormyworld.org">Global Atlas of Helminth Infections</a><br />
        </Typography>

        <Typography gutterBottom variant="h3"><br />Modelling publications</Typography>
        <Typography paragraph variant="body1" component="p">
          <a href="http://www.cell.com/trends/parasitology/fulltext/S1471-4922(17)30305-7">The Population Biology and Transmission Dynamics of Loa loa</a><br />
            Whittaker C, Walker M, Pion SDS, Chesnais CB, Boussinesq M, Basáñez MG <strong>Trends in Parasitology</strong>, 2018; : Epub<br /><br />
<a href="https://parasitesandvectors.biomedcentral.com/articles/10.1186/s13071-018-2655-5">Identifying co-endemic areas for major filarial infections in sub-Saharan Africa: seeking synergies and preventing severe adverse events during mass drug administration campaigns</a><br />
 Cano J, Basáñez MG, O'Hanlon SJ, Tekle AH, Wanji S, Zouré HG, Rebollo MP, Pullan RL <strong>Parasites and Vectors</strong>, 2018; 1: 70<br /><br />
<a href="http://trstmh.oxfordjournals.org/content/110/2/118.short?rss=1">Understanding the relationship between prevalence of microfilariae and antigenaemia using a model of lymphatic filariasis infection</a><br />
 Michael A. Irvine, Sammy M. Njenga, Shamini Gunawardena, Claire Njeri Wamae, Jorge Cano, Simon J. Brooker and T. Deirdre Hollingsworth <strong>Transactions of the Royal Society of Tropical Medicine and Hygiene</strong>, 2016; : 118-124<br /><br />
<a href="http://bmcmedicine.biomedcentral.com/articles/10.1186/s12916-016-0557-y">Heterogeneous dynamics, robustness/fragility trade-offs, and the eradication of the macroparasitic disease, lymphatic filariasis</a><br />
 Edwin Michael and Brajendra K. Singh <strong>BioMed Central, 2016; : 14:14</strong><br /><br />
<a href="http://www.parasitesandvectors.com/content/8/1/522">Bayesian calibration of simulation models for supporting management of the elimination of the macroparasitic disease, Lymphatic Filariasis</a><br />
 Singh BK, Michael E. <strong>Parasites & Vectors</strong>, 2015; 8: 522<br />
 </Typography>










        <Typography paragraph variant="body2" component="p">
          Need a copy text element here paragraph
        </Typography>

      </TextContents>
    </Layout>
  )
}
export default DataMethodology;
