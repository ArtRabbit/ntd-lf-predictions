import { Random } from "./sim";
export var s = new Random();
export var SessionData = {
    storeResults: (results, scenLabel, stats) => {
        //takes results: an Array of json with each json obj having ts, Ms, Ws.
        //combines these with parameter information and stores to be retrieved whenever.
        var sessionData = JSON.parse(localStorage.getItem("sessionData")); //retrieve session dat from storage.
        if (sessionData == null || sessionData.scenarios == null) {
            sessionData = { scenarios: [] };
        }
        if (scenLabel == null) {
            scenLabel = "Scenario " + (ScenarioIndex.getIndex() + 1);
        }
        var scenario = { params: params, results: results, label: scenLabel };
        var scenInd = ScenarioIndex.getIndex();

        sessionData.scenarios[scenInd] = scenario;
        var toStore = JSON.stringify(sessionData);
        try {
            localStorage.setItem("sessionData", toStore);
        } catch (error) {
            alert("Too many scenarios to store. Try deleting some.");
        }
        return sessionData;
    },
    storeSession: session => {
        var toStore = JSON.stringify(session);
        localStorage.setItem("sessionData", toStore);
    },
    storeStats: stats => {
        var sessionData = JSON.parse(localStorage.getItem("sessionData")); //retrieve session dat from storage.
        var scenInd = ScenarioIndex.getIndex();
        sessionData.scenarios[scenInd]["stats"] = stats;
        var toStore = JSON.stringify(sessionData);
        localStorage.setItem("sessionData", toStore);
    },
    createNewSession: () => {
        var sessionData = JSON.parse(localStorage.getItem("sessionData"));
        if (sessionData == null || sessionData.scenarios == null) {
            sessionData = { scenarios: [] };
        }
        var scenario = { params: params, results: [] };
        var scenInd = ScenarioIndex.getIndex();

        sessionData.scenarios[scenInd] = scenario;
        var toStore = JSON.stringify(sessionData);
    },
    deleteSession: () => {
        //delete session data to start fresh when page loads.
        localStorage.setItem("sessionData", null);
    },
    retrieveSession: () => {
        var ses = JSON.parse(localStorage.getItem("sessionData"));
        if (ses && ses.scenarios && ses.scenarios[0] && ses.scenarios[0].label) {
            return ses;
        } else {
            ses = { scenarios: [] };
            var toStore = JSON.stringify(ses);
            localStorage.setItem("sessionData", toStore);
            return ses;
        }
    },
    numScenarios: () => {
        var ses = SessionData.retrieveSession(); //////////////////
        if (ses == null || ses.scenarios == null) {
            return 0;
        } else {
            return ses.scenarios.length;
        }
    },
    convertRun: (m, endemicity) => {
        //convert model object to JSON for run.
        return {
            ts: m.ts,
            Ms: m.Ms,
            Ws: m.Ws,
            Ls: m.Ls,
            reductionYears: m.reductionYears(),
            nRounds: m.nRounds(),
            endemicity: endemicity
        };
    },
    nRounds: i => {
        var ses = SessionData.retrieveSession();
        var scen = ses.scenarios[i];
        var n = scen.results.length;
        var rounds = [];
        for (var j = 0; j < n; j++) {
            rounds.push(scen.results[j].nRounds);
        }
        return rounds;
    },
    reductions: (i, yr, endemicity) => {
        var ses = SessionData.retrieveSession();
        var scen = ses.scenarios[i];
        var n = scen.results.length;
        var red = 0;
        var nn = 0;
        for (var j = 0; j < n; j++) {
            if (endemicity) {
                if (scen.results[j].endemicity == endemicity) {
                    red += scen.results[j].reductionYears[yr];
                    nn += 1;
                }
            } else {
                red += scen.results[j].reductionYears[yr];
                nn += 1;
            }
        }
        return red / nn;
    },
    ran: i => {
        var ses = SessionData.retrieveSession();

        if (!ses) {
            return false;
        }
        if (!ses.scenarios[i]) {
            return false;
        }

        var res = ses.scenarios[i].results;
        if (res.length > 0) {
            return true;
        } else {
            return false;
        }
    },
    deleteScenario: () => {
        var ind = ScenarioIndex.getIndex();
        var ses = SessionData.retrieveSession();
        ses.scenarios.splice(ind, 1);
        var toStore = JSON.stringify(ses);
        localStorage.setItem("sessionData", toStore);
        ScenarioIndex.setIndex(0);
    }
};
export var ScenarioIndex = {
    getIndex: function() {
        return Number(localStorage.getItem("scenarioIndex"));
    },
    setIndex: function(ind) {
        try {
            var ses = SessionData.retrieveSession();
            var scen = ses.scenarios[ind];
            params = scen.params;
        } catch (err) {}

        return localStorage.setItem("scenarioIndex", ind);
    }
};
export var Person = function(a, b) {
    //constructor(a,b) {
    this.b = s.gamma(a, b);
    this.M = 0.5;
    this.W = 0;
    this.WM = 0;
    this.WF = 0;
    this.I = 0;
    this.bednet = 0;
    this.t = 0;
    this.u = s.normal(params.u0, Math.sqrt(params.sigma));

    //}

    this.repRate = function() {
        if (params.nu == 0) {
            if (this.WM > 0) {
                return this.WF;
            } else {
                return 0.0;
            }
        } else {
            return params.alpha * Math.min(this.WF, (1 / params.nu) * this.WM);
        }
    };

    this.biteRate = function() {
        if (this.a < 108.0) {
            //less than 9 * 12 = 108.0
            return this.a / 108.0;
        } else {
            return 1.0;
        }
    };

    this.react = function() {
        var bNReduction = 1 - (1 - params.sN) * this.bedNet;
        //immune state update

        //I +=  (param->dt) *( (double) W - param->z * I);
        this.I = statFunctions.immuneRK4Step(this.W, this.I);
        //male worm update
        var births = statFunctions.poisson(0.5 * bNReduction * params.xi * this.biteRate() * params.L3 * Math.exp(-1 * params.theta * this.I) * this.b * params.dt); //exp(-1 * beta * I)
        //births = param->poisson_dist(0.5 * param->xi  * biteRate() * param->L3 * exp(-1 * param->theta * I) * b *  param->dt); //exp(-1 * beta * I)
        var deaths = statFunctions.poisson(params.mu * this.WM * params.dt);
        this.WM += births - deaths;

        //female worm update
        births = statFunctions.poisson(0.5 * bNReduction * params.xi * this.biteRate() * params.L3 * Math.exp(-1 * params.theta * this.I) * this.b * params.dt); //* exp(-1 * beta * I)
        //births = param->poisson_dist(0.5  * param->xi  * biteRate() * param->L3 * exp(-1 * param->theta * I) * b *  param->dt); //exp(-1 * beta * I)
        deaths = statFunctions.poisson(params.mu * this.WF * params.dt);
        this.WF += births - deaths;

        //Mf update
        //births = poisson(param->alpha * WF * WM);
        //deaths = poisson(param->gamma * M);
        //M += births - deaths;
        this.M += params.dt * (this.repRate() - params.gamma * this.M);
        //M += param->dt * (repRate() - param->gamma * M);
        //total worm count
        this.W = this.WM + this.WF;
        //time-step
        this.t += params.dt;
        this.a += params.dt;
        //ensure all positive state variables remain positive
        if (this.W < 0) {
            this.W = 0;
        }
        if (this.WM < 0) {
            this.WM = 0;
        }
        if (this.WF < 0) {
            this.WF = 0;
        }
        if (this.I < 0) {
            this.I = 0.0;
        }
        if (this.M < 0) {
            this.M = 0.0;
        }
        //simulate event where host dies and is replaced by a new host.
        if (Math.random() < 1 - Math.exp(-1 * params.tau * params.dt) || this.a > 1200.0) {
            //if over age 100
            this.initialise();
            this.a = 0; //birth event so age is 0.
        }
    };

    this.initialise = function() {
        this.W = 0;
        this.WM = 0;
        this.WF = 0;
        this.I = 0.0;
        this.M = 0.0; //0
        this.bedNet = 0;
        this.u = s.normal(params.u0, Math.sqrt(params.sigma));
    };
};
export var Model = function(n) {
    //constructor(n){

    this.sU = 0;
    this.sB = 0;
    this.sN = 0;
    this.people = new Array();
    this.n = n;
    this.bedNetInt = 0;
    this.ts = [];
    this.Ms = [];
    this.Ws = [];
    this.Ls = [];
    for (var i = 0; i < n; i++) {
        this.people.push(new Person(params.a, params.b));
    }
    //}

    this.saveOngoing = function(t, mp, wp, lp) {
        lp = 1 - Math.exp(-lp); //convert to a prevalence
        this.ts.push(t);
        this.Ms.push(mp * 100); //convert all to percentages.
        this.Ws.push(wp * 100);
        this.Ls.push(lp * 100);
    };

    this.L3 = function() {
        var mf = 0.0;
        var bTot = 0.0;
        for (var i = 0; i < this.n; i++) {
            //mf += param->kappas1 * pow(1 - exp(-param->r1 *( host_pop[i].mfConc() * host_pop[i].b)/param->kappas1), 2.0);
            mf += this.people[i].b * statFunctions.L3Uptake(this.people[i].M);
            bTot += this.people[i].b;
        }
        mf = mf / bTot; //(double) n;
        return (mf * (1 + this.bedNetInt * params.covN * (params.sN - 1)) * params.lbda * params.g) / (params.sig + params.lbda * params.psi1);
    };

    this.prevalence = function() {
        var p = 0;
        for (var i = 0; i < this.n; i++) {
            p += s.random() < 1 - Math.exp(-this.people[i].M);
        }
        return p / this.n;
    };

    this.aPrevalence = function() {
        var p = 0;
        for (var i = 0; i < this.n; i++) {
            p += this.people[i].W > 0;
        }
        return p / this.n;
    };

    this.MDAEvent = function() {
        for (var i = 0; i < this.n; i++) {
            if (s.normal(this.people[i].u, 1) < 0) {
                //param->uniform_dist()<param->covMDA
                this.people[i].M = params.mfPropMDA * this.people[i].M;
                this.people[i].WM = Math.floor(params.wPropMDA * this.people[i].WM);
                this.people[i].WF = Math.floor(params.wPropMDA * this.people[i].WF);
            }
        }
    };

    this.bedNetEvent = function() {
        params.sig = params.sig + params.lbda * params.dN * params.covN;
        for (var i = 0; i < this.n; i++) {
            if (s.random() < params.covN) {
                //param->uniform_dist()<param->covMDA
                this.people[i].bedNet = 1; //using bed-net
            } else {
                this.people[i].bedNet = 0; //not using bed-net
            }
        }
    };

    this.nRounds = function() {
        var inds = [];
        for (var i = 0; i < this.Ms.length; i++) {
            if (this.Ms[i] < 1.0) {
                inds.push(i);
            }
        }
        if (params.mdaFreq == 12) {
            return Math.floor(this.ts[inds[0]]);
        } else {
            return Math.floor(2 * this.ts[inds[0]]);
        }
    };

    this.reduction = function(yr) {
        var myr = yr * 6;
        return this.Ms[myr] / this.Ms[0];
    };

    this.reductionYears = function() {
        var ryrs = [];
        for (var yr = 0; yr < 20; yr++) {
            ryrs.push(this.reduction(yr));
        }
        return ryrs;
    };

    this.evolveAndSaves = function(tot_t) {
        var t = 0;
        var icount = 0;
        var maxMDAt = 1200.0;
        var maxoldMDAt; //used in triple drug treatment.
        this.bedNetInt = 0;

        for (var i = 0; i < this.n; i++) {
            //infect everyone initially.
            //this.people[i].WM = 1;
            //this.people[i].WF = 1;
            this.people[i].M = 1.0;
        }
        maxMDAt = 1200.0 + params.nMDA * params.mdaFreq;
        if (params.IDAControl == 1) {
            //if switching to IDA after five treatment rounds.
            maxoldMDAt = 1200.0 + 5.0 * params.mdaFreq;
        } else {
            maxoldMDAt = 2 * maxMDAt; //this just makes maxoldMDAt larger than total treatment time so there is never a switch.
        }

        //double currentL3 = 0.5;
        // console.log("mosquito species: ", params.mosquitoSpecies, "\n");
        params.L3 = 5.0;
        // console.log("0----------100\n-");
        while (t < tot_t * 12.0) {
            //for 100 years update annually, then update monthly when recording and intervention is occuring.
            if (t < 960.0) {
                //1200.0
                params.dt = 12.0;
            } else {
                params.dt = 1.0;
            }
            for (var i = 0; i < this.n; i++) {
                this.people[i].react();
            }
            //update
            t = this.people[0].t;
            if (t < 12.0 * 80.0) {
                params.L3 = 2.0;
            } else {
                params.L3 = this.L3();
            }
            if (t % 2 == 0 && t < Math.floor(t) + params.dt) {
                //cout << "t = " << (double) t/12.0 << "\n";
                this.saveOngoing(t / 12.0, this.prevalence(), this.aPrevalence(), params.L3);
            }
            if (Math.floor(t) % Math.floor((tot_t * 12.0) / 10.0) == 0 && t < Math.floor(t) + params.dt) {
                //every 10% of time run.
                // console.log("-");
                //        $("#test1").append(" p : " + this.prevalence() + " t : " + t / 12.0);
            }
            if (t >= 1200.0 && t < 1200.0 + params.dt) {
                //events that occur at start of treatment after 100 years.
                // console.log("bednet event at ", t);
                this.bedNetEvent();
                this.bedNetInt = 1;
            }

            if (t % params.mdaFreq == 0 && t < Math.floor(t) + params.dt) {
                //things that need to occur annually
                //if(t>maxoldMDAt){
                //  params.mfPropMDA = (1-params.IDAchi);//0.0;
                //  params.wPropMDA = (1-params.IDAtau);//0.0;
                //}
                if (t > 1200.0 && t <= maxMDAt) {
                    //if after one hundred years and less than 125 years.
                    this.MDAEvent();

                    statFunctions.setBR(true); //intervention true.
                    statFunctions.setVH(true);
                    statFunctions.setMu(true);
                } else {
                    statFunctions.setBR(false); //intervention false.
                    statFunctions.setVH(false);
                    statFunctions.setMu(false);
                }
            }
            icount++;
        }
        this.Ws = this.Ws.slice(200, this.Ws.length);
        this.Ms = this.Ms.slice(200, this.Ms.length);
        this.Ls = this.Ls.slice(200, this.Ls.length);
        var maxt = this.ts[200];
        // this.ts = math.subtract(this.ts.slice(200, this.ts.length), maxt); // !!!!!!!!!!!!!!
        this.ts = this.ts.slice(200, this.ts.length) - maxt; // I replaced the math.subtract() with a simple "-" operator - is that bad???
        //plot(this.ts,this.Ws,this.Ms,this.Ls);
    };
};
export var params = {
    riskMu1: 1.0,
    riskMu2: 1.0,
    riskMu3: 1.0,
    shapeRisk: 0.065, //shape parameter for bite-risk distribution (0.1/0.065)
    mu: 0.0104, //death rate of worms
    theta: 0.0, //0.001 //immune system response parameter. 0.112
    gamma: 0.1, //mf death rate
    alpha: 0.58, //mf birth rate per fertile worm per 20 uL of blood.
    lbda: 10, //number of bites per mosquito per month.
    v_to_h: 9.0, //vector to host ratio (39.,60.,120.)
    kappas1: 4.395, //vector uptake and development anophelene
    r1: 0.055, //vector uptake and development anophelene
    tau: 0.00167, //death rate of population
    z: 0.0, //waning immunity
    nu: 0.0, //poly-monogamy parameter
    L3: 0.0, //larvae density.
    g: 0.37, //Proportion of mosquitoes which pick up infection when biting an infected host
    sig: 5.0, //death rate of mosquitos
    psi1: 0.414, //Proportion of L3 leaving mosquito per bite
    psi2: 0.32, //Proportion of L3 leaving mosquito that enter host
    dt: 1.0, //time spacing (months)
    lbdaR: 1.0, //use of bed-net leading to reduction in bite rate
    v_to_hR: 1.0, //use of residual-spraying leading to reduction in v_to_h
    nMDA: 5, //number of rounds of MDA
    mdaFreq: 12, //frequency of MDA (months)
    covMDA: 0.65, //coverage of MDA
    s2: 0.00275, //probability of L3 developing into adult worm.
    mfPropMDA: 0.05, //proportion of mf removed for a single MDA round.
    wPropMDA: 0.45, //proportion of worms permanently sterilised for a single MDA round. (0.55)
    rho: 0.999, //proportion of systematic non-compliance 0- none 1- all.
    mosquitoSpecies: 0, // 0 - Anopheles facilitation squared, 1 - Culex limitation linear.
    rhoBU: 0.0, //correlation between bite risk and systematic non-compliance.
    aWol: 0, //using doxycycline in intervention 0- not used, 1- is used.
    sigR: 5.0, //new mortality rate of mosquitoes during vector intervention.
    covN: 0.0, //coverage of bed nets.
    sysCompN: 0.99, //systematic non-compliance of bed nets. set to near one.
    rhoCN: 0.0, //correlation between receiving chemotherapy and use of bed nets.
    IDAControl: 0 //if 1 then programme switches to IDA after five rounds of standard MDA defined with chi and tau.
};
export var statFunctions = {
    immuneRK4Step: function(W, I) {
        var k1 = params.dt * (W - params.z * I);
        var k2 = params.dt * (W - params.z * (I + 0.5 * k1));
        var k3 = params.dt * (W - params.z * (I + 0.5 * k2));
        var k4 = params.dt * (W - params.z * (I + k3));
        return I + 0.1666667 * (k1 + 2.0 * k2 + 2.0 * k3 + k4);
    },

    L3Uptake: function(mf) {
        if (params.mosquitoSpecies == 0) {
            return params.kappas1 * Math.pow(1 - Math.exp((-params.r1 * mf) / params.kappas1), 2.0);
        } else {
            return params.kappas1 * (1 - Math.exp((-params.r1 * mf) / params.kappas1));
        }
    },

    expTrunc: function(lambda, trunc) {
        return (-1 / lambda) * Math.log(1 - Math.random() * (1 - Math.exp(-lambda * trunc)));
    },

    poisson: function(mean) {
        var L = Math.exp(-mean);
        var p = 1.0;
        var k = 0;

        do {
            k++;
            p *= Math.random();
        } while (p > L);

        return k - 1;
    },

    NormSInv: function(p) {
        var a1 = -39.6968302866538,
            a2 = 220.946098424521,
            a3 = -275.928510446969;
        var a4 = 138.357751867269,
            a5 = -30.6647980661472,
            a6 = 2.50662827745924;
        var b1 = -54.4760987982241,
            b2 = 161.585836858041,
            b3 = -155.698979859887;
        var b4 = 66.8013118877197,
            b5 = -13.2806815528857,
            c1 = -7.78489400243029e-3;
        var c2 = -0.322396458041136,
            c3 = -2.40075827716184,
            c4 = -2.54973253934373;
        var c5 = 4.37466414146497,
            c6 = 2.93816398269878,
            d1 = 7.78469570904146e-3;
        var d2 = 0.32246712907004,
            d3 = 2.445134137143,
            d4 = 3.75440866190742;
        var p_low = 0.02425,
            p_high = 1 - p_low;
        var q, r;
        var retVal;

        if (p < 0 || p > 1) {
            console.error("NormSInv: Argument out of range.");
            retVal = 0;
        } else if (p < p_low) {
            q = Math.sqrt(-2 * Math.log(p));
            retVal = (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
        } else if (p <= p_high) {
            q = p - 0.5;
            r = q * q;
            retVal = ((((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q) / (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
        } else {
            q = Math.sqrt(-2 * Math.log(1 - p));
            retVal = -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
        }

        return retVal;
    },

    setBR: function(intervention) {
        if (intervention) {
            params.lbda = params.lbdaR * params.lbda_original;
            params.xi = params.lbda * params.v_to_h * params.psi1 * params.psi2 * params.s2;
        } else {
            params.lbda = params.lbda_original;
            params.xi = params.lbda * params.v_to_h * params.psi1 * params.psi2 * params.s2;
        }
    },

    setVH: function(intervention) {
        if (intervention) {
            params.v_to_h = params.v_to_hR * params.v_to_h_original;
            params.xi = params.lbda * params.v_to_h * params.psi1 * params.psi2 * params.s2;
        } else {
            params.v_to_h = params.v_to_h_original;
            params.xi = params.lbda * params.v_to_h * params.psi1 * params.psi2 * params.s2;
        }
    },

    setMu: function(intervention) {
        if (intervention) {
            params.sig = params.sigR; //increase mortality due to bed nets. dN = 0.41 death rate
        } else {
            params.sig = params.sig_original;
        }
    },

    setPropMDA: function(regimen) {
        // var ps = simControler.modelParams();
        var ps = simControler.params;
        var chis = [0.99, 0.95, 0.99, 1.0, Number(ps.microfilaricide) / 100, 0.99];
        var taus = [0.35, 0.55, 0.1, 1.0, Number(ps.macrofilaricide) / 100, 0.1];
        params.mfPropMDA = 1 - chis[Number(regimen) - 1];
        params.wPropMDA = 1 - taus[Number(regimen) - 1];
    },

    closest: function(num, arr) {
        var mid;
        var lo = 0;
        var hi = arr.length - 1;
        while (hi - lo > 1) {
            mid = Math.floor((lo + hi) / 2);
            if (arr[mid] < num) {
                lo = mid;
            } else {
                hi = mid;
            }
        }
        if (num - arr[lo] <= arr[hi] - num) {
            return lo;
        }
        return hi;
    },

    setVHFromPrev: function(p, species) {
        /*
        var anVH = [5., 5.55555556, 6.11111111, 6.66666667, 7.22222222, 7.77777778, 8.33333333, 8.88888889, 9.44444444,  10. ],
            cVH = [ 4.,  4.55555556,  5.11111111,  5.66666667,  6.22222222, 6.77777778,  7.33333333,  7.88888889,  8.44444444,  9.],
            anP = [ 0.09405936,  0.09882859,  0.11038997,  0.11982386,  0.12751358, 0.13604286,  0.14459468,  0.15150072,  0.15736517,  0.16302997],
            cP = [ 0.09306863,  0.11225442,  0.1267763 ,  0.13999753,  0.15040748, 0.16114762,  0.16863057,  0.17532108,  0.1827041 ,  0.18676246];
    */
        var anVH = [3.66666667, 4, 4.33333333, 4.66666667, 5, 5.55555556, 6.11111111, 6.66666667, 7.22222222, 7.77777778, 8.33333333, 8.88888889, 9.44444444, 10],
            cVH = [3.33333333, 3.66666667, 4, 4.55555556, 5.11111111, 5.66666667, 6.22222222, 6.77777778, 7.33333333, 7.88888889, 8.44444444, 9, 9.5, 10, 10.5, 11],
            anP = [
                0.06232983,
                0.08068697,
                0.07112745,
                0.07718782,
                0.09405936,
                0.09882859,
                0.11038997,
                0.11982386,
                0.12751358,
                0.13604286,
                0.14459468,
                0.15150072,
                0.15736517,
                0.16302997
            ],
            cP = [
                0.0472584,
                0.05289496,
                0.05937815,
                0.06394662,
                0.0715854,
                0.08006637,
                0.09306863,
                0.11225442,
                0.1267763,
                0.13999753,
                0.15040748,
                0.16114762,
                0.16863057,
                0.17532108,
                0.1827041,
                0.18676246
            ];
        var vhs, prevs;
        if (species === 0) {
            vhs = anVH;
            prevs = anP;
        } else {
            vhs = cVH;
            prevs = cP;
        }

        var i = this.closest(p, prevs);
        return vhs[i];
    },

    setInputParams: function(dict) {
        // var ps = simControler.modelParams();
        var ps = simControler.params;
        params.inputs = ps;
        params.runs = Number(ps.runs);
        params.nMDA = dict && dict.nMDA ? dict.nMDA : Number(ps.mda);
        params.mdaFreq = ps.mdaSixMonths === "True" ? 6.0 : 12.0;
        var end = dict && dict.endemicity ? dict.endemicity / 100 : ps.endemicity / 100;
        var sps = ps.species;
        params.v_to_h = Number(statFunctions.setVHFromPrev(end, Number(sps))); //Number(ps.endemicity);//
        params.covMDA = Number(ps.coverage / 100.0);
        params.covN = Number(ps.covN / 100);
        params.v_to_hR = 1 - Number(ps.v_to_hR / 100);
        params.vecCap = Number(ps.vecCap);
        params.vecComp = Number(ps.vecComp);
        params.vecD = Number(ps.vecD);
        statFunctions.setPropMDA(Number(ps.mdaRegimen));
        params.rho = Number(ps.rho);
        params.rhoBComp = Number(ps.rhoBComp);
        params.rhoCN = Number(ps.rhoCN);
        params.species = Number(ps.species);
        params.mosquitoSpecies = params.species;
        //calculate other parameters for params
        if (params.species == 0) {
            params.shapeRisk = 0.065;
        } else {
            params.shapeRisk = 0.08;
        }
        params.lbda_original = params.lbda;
        params.v_to_h_original = params.v_to_h;
        params.sig_original = params.sig;
        params.xi = params.lbda * params.v_to_h * params.psi1 * params.psi2 * params.s2; //constant bite rate (5760.0 / 30.0)
        params.a = params.shapeRisk; //shape parameter (can vary)
        params.b = 1 / params.a; //scale parameter determined so mean is 1.
        //sys-compliance parameters
        params.sigma = params.rho / (1 - params.rho);
        params.u0 = -statFunctions.NormSInv(params.covMDA) * Math.sqrt(1 + params.sigma);
    }
};
export var simControler = {
    /*
    DEFINE CLASS SESSION DATA TO STORE AND RETRIEVE RUNS.
    Data structure
    session ---- scenarios ---- ---- ---- params
                        ----      ---- label
                        ----      ---- stats   ----  ts
                        ----                   ----  doses
                        ----                   ----  prev_reds
                        ----                   ----  num_rounds
                        ----
                        ----      ---- results ----  ---- ---- Ws
                        ----                   ----       ---- Ms
                        ----                   ----       ---- ts
                                                ----       ---- doses
                                                            ---- Ls


    */
    //////////////////////////////////////////
    /* DOM manipulation */

    scenarioRunStats: simulatorCallback => {
        var scenInd = ScenarioIndex.getIndex();
        var scenario = SessionData.retrieveSession()["scenarios"][scenInd];
        var ts = [],
            dyrs = [],
            ryrs = [];

        ts = scenario["results"][0]["ts"];

        var stats = simControler.reductionStatsCalc(scenario, params.covMDA);

        dyrs = stats.doses;
        ryrs = stats.reduction;

        console.log(ts);
        console.log(dyrs);
        SessionData.storeStats({ ts: ts, prev_reds: ryrs, doses: dyrs, Ws: stats.medW, Ms: stats.medM, Ls: stats.medL });

        // simControler.dump(scenario);
        // $("#scenario-statistic")[0].innerHTML = JSON.stringify(obj);
        simulatorCallback(JSON.stringify(scenario));
        // console.log(JSON.stringify(scenario));
        // return JSON.stringify(scenario);
        //fixInput(false);
    },
    median: values => {
        values.sort(function(a, b) {
            return a - b;
        });

        var half = Math.floor(values.length / 2);

        if (values.length % 2) return values[half];
        else return (values[half - 1] + values[half]) / 2.0;
    },
    runMapSimulation: function(simulatorCallback) {
        statFunctions.setInputParams({ nMDA: 40 });
        // var scenLabel = $("#inputScenarioLabel").val();
        //max number of mda rounds even if doing it six monthly.
        var maxN = simControler.params.runs; // Number($("#runs").val());
        var runs = [];
        var progression = 0;
        this.fixInput();

        var progress = setInterval(() => {
            var m = new Model(800);
            m.evolveAndSaves(120.0);
            runs.push(SessionData.convertRun(m));
            simulatorCallback(parseInt((progression * 100) / maxN));
            if (progression === maxN) {
                // $("#map-progress-bar").hide();
                clearInterval(progress);
                SessionData.storeResults(runs, "scenLabel 1");
                simControler.scenarioRunStats(simulatorCallback);
            } else {
                progression += 1;
            }
        }, 10);
    },
    reductionStatsCalc: (scenario, coverage) => {
        var n = scenario["results"].length;
        //        var T = scenario["results"][0]["ts"].length;  //scenario["results"][0]["ts"].length; !!!!!!!!!!!!!! doesnt seem to work
        // var T = 0;
        var T = scenario["results"] && scenario["results"][0] && scenario["results"][0]["ts"] ? scenario["results"][0]["ts"].length : 0;  // this is just a hotfix so it doesn't crash, however things don't work as they are supposed to
        console.log("T");
        console.log(T);
        var prev0;
        var totR = new Array(T);
        var doses = new Array(T);
        var medM = new Array(T);
        var medW = new Array(T);
        var medL = new Array(T);
        var doses_year = params.mdaFreq === 6 ? 2 : 1;
        for (var t = 0; t < T; t++) {
            totR[t] = 0;
            doses[t] = 0;
            // eslint-disable-next-line no-unused-expressions
            var mM = [],
                mW = [],
                mL = [];
            for (var i = 0; i < n; i++) {
                var prev;
                prev0 = prev = scenario["results"][i]["Ms"][0];
                var red = scenario["results"][i]["Ms"][t] / prev0;
                prev = scenario["results"][i]["Ms"][t];
                mM.push(scenario["results"][i]["Ms"][t]);
                mW.push(scenario["results"][i]["Ws"][t]);
                mL.push(scenario["results"][i]["Ls"][t]);
                totR[t] += red;
                if (prev > 1.0) doses[t] += 100000 * coverage * doses_year;
            }
            totR[t] = (1 - totR[t] / n) * 100.0;
            doses[t] = doses[t] / n;
            medM[t] = simControler.median(mM);
            medW[t] = simControler.median(mW);
            medL[t] = simControler.median(mL);
        }

        return {
            reduction: totR,
            doses: doses,
            medM: medM,
            medW: medW,
            medL: medL
        };
    },
    runScenario: function(paramsFromUI, simulatorCallback) {
        //        console.log(paramsFromUI);
        this.params = { ...paramsFromUI };
        var i = SessionData.numScenarios();
        ScenarioIndex.setIndex(i);
        SessionData.createNewSession();
        // console.log(this);
        /*     simControler.fixInput(false); */

        if (SessionData.ran(i)) {
            ScenarioIndex.setIndex(i);
            // $("#settings-modal").modal("hide");
        } else {
            this.runMapSimulation(simulatorCallback);
            // simulatorCallback();
            // return "aaaa";
            // return houby;
        }
    },
    fixInput: fix_input => {
        var curScen = ScenarioIndex.getIndex();
        if (fix_input == null) {
            fix_input = true;
        }
        if (fix_input) {
        } else {
            /*       $("#inputScenarioLabel")
        .attr("disabled", false)
        .val("Scenario " + (curScen + 1)); */
        }
    },
    documentReady: function() {
        params.lbda_original = params.lbda;
        params.v_to_h_original = params.v_to_h;
        params.sig_original = params.sig;
        params.xi = params.lbda * params.v_to_h * params.psi1 * params.psi2 * params.s2; //constant bite rate (5760.0 / 30.0)
        params.a = params.shapeRisk; //shape parameter (can vary)
        params.b = 1 / params.a; //scale parameter determined so mean is 1.
        //bed net parameters
        params.sN = 0.03;
        params.dN = 0.41;
        //sys-compliance parameters
        params.sigma = params.rho / (1 - params.rho);
        params.u0 = -statFunctions.NormSInv(params.covMDA) * Math.sqrt(1 + params.sigma);

        SessionData.deleteSession();
        ScenarioIndex.setIndex(0);
    },
    params: {
        coverage: 90, // $("#MDACoverage").val(),
        mda: 2, // $("#inputMDARounds").val(),
        mdaSixMonths: 6, // $("input:radio[name=mdaSixMonths]:checked").val(),
        endemicity: 10, // $("#endemicity").val(),
        covN: 0, // $("#bedNetCoverage").val(),
        v_to_hR: 0, // $("#insecticideCoverage").val(),
        vecCap: 0, // $("#vectorialCapacity").val(),
        vecComp: 0, //$("#vectorialCompetence").val(),
        vecD: 0, //$("#vectorialDeathRate").val(),
        mdaRegimen: 1, // $("input[name=mdaRegimenRadios]:checked").val(),
        rho: 0.2, // $("#sysAdherence").val(),
        rhoBComp: 0, // $("#brMda").val(),
        rhoCN: 0, // $("#bedNetMda").val(),
        species: 0, // $("input[name=speciesRadios]:checked").val(),
        macrofilaricide: 65, // $("#Macrofilaricide").val(),
        microfilaricide: 65, // $("#Microfilaricide").val(),
        runs: 5 // $("#runs").val()
    }
};
