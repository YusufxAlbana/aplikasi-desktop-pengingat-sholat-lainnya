export namespace main {
	
	export class Ayah {
	    numberInSurah: number;
	    text: string;
	    audio: string;
	
	    static createFrom(source: any = {}) {
	        return new Ayah(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.numberInSurah = source["numberInSurah"];
	        this.text = source["text"];
	        this.audio = source["audio"];
	    }
	}
	export class PrayerResult {
	    timings: Record<string, string>;
	    latitude: number;
	    longitude: number;
	
	    static createFrom(source: any = {}) {
	        return new PrayerResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.timings = source["timings"];
	        this.latitude = source["latitude"];
	        this.longitude = source["longitude"];
	    }
	}
	export class Surah {
	    number: number;
	    name: string;
	    englishName: string;
	    revelationType: string;
	
	    static createFrom(source: any = {}) {
	        return new Surah(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.number = source["number"];
	        this.name = source["name"];
	        this.englishName = source["englishName"];
	        this.revelationType = source["revelationType"];
	    }
	}
	export class SurahDetail {
	    number: number;
	    name: string;
	    englishName: string;
	    ayahs: Ayah[];
	
	    static createFrom(source: any = {}) {
	        return new SurahDetail(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.number = source["number"];
	        this.name = source["name"];
	        this.englishName = source["englishName"];
	        this.ayahs = this.convertValues(source["ayahs"], Ayah);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

