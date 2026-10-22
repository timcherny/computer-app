export const fragmentShader = `precision highp float;
 varying vec2 uv; uniform vec2 cropOrigin,cropSize;
 uniform float seed,t,grain,softness,motion,detail,distortion,blueAmount,blackAmount,orangeAmount;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float blob(vec2 p,vec2 c,vec2 size){vec2 d=(p-c)/size;return exp(-dot(d,d)*2.);}
 void main(){
 float s=seed;
 float phase=(t-.5)*motion;
 vec2 p=cropOrigin+uv*cropSize;
 p.y+=phase*.2;
 p+=distortion*2.*.045*vec2(sin(p.y*9.+s+phase*3.),cos(p.x*8.+s*.7-phase*2.));
 p+=distortion*2.*.018*vec2(sin(p.y*24.+p.x*11.+s-phase*2.),cos(p.x*27.-p.y*13.+s+phase*3.));
 float f=0.;
 for(int i=0;i<5;i++){
 float k=float(i);
 vec2 c=vec2(.5)+.30*vec2(sin(s*1.7+k*2.1+phase*(.4+k*.17)),cos(s*.8+k*2.7-phase*.8));
 vec2 z=vec2(.29+.10*sin(k+s),.32+.12*cos(k*1.3+s));
 f+=blob(p,c,z)*(.70+.20*sin(k+s));
 }
 for(int j=0;j<7;j++){
 float k=float(j);
 vec2 c=vec2(.5)+.39*vec2(sin(s*2.3+k*2.4+phase*.5),cos(s*1.1+k*1.9-phase*.6));
 f+=blob(p,c,vec2(.10+.035*sin(k+s),.13+.04*cos(k+s)))*.30*detail*2.;
 }
 float edge=.009+softness*.025;
 float outer=smoothstep(.23-edge,.23+edge,f);
 float inside=smoothstep(.38,.66+softness*.18,f);
 vec3 gray=vec3(177.,177.,186.)/255.;
 vec3 orange=vec3(245.,97.,16.)/255.;
 vec3 blue=vec3(12.,108.,214.)/255.;
 vec3 black=vec3(18.,14.,14.)/255.;
 float b=sin(p.x*7.+s+phase*2.)+cos(p.y*8.-s*.7-phase*3.)+.3*sin(p.x*16.+p.y*12.+s);
 b+=detail*2.*(.38*sin(p.x*29.+p.y*17.+s+phase*2.)+.22*cos(p.y*37.-p.x*12.-s));
 float blueMask=smoothstep(.10,.65+softness,b);
 vec3 core=mix(black,blue,blueMask);
 float pocket=sin(p.x*21.+s+phase*1.5)*cos(p.y*18.-s-phase);
 float warm=smoothstep(.61,.83+softness*.12,pocket)*min(1.,detail*1.7);
 core=mix(core,orange,warm);
 // Weight color coverage independently; gray fills any removed coverage.
 float wb=outer*inside*(1.-warm)*blueMask;
 float wk=outer*inside*(1.-warm)*(1.-blueMask);
 float wo=outer*((1.-inside)+inside*warm);
 float wg=1.-outer;
 wg+=wb*(1.-min(1.,blueAmount*2.))+wk*(1.-min(1.,blackAmount*2.))+wo*(1.-min(1.,orangeAmount*2.));
 wb*=blueAmount*2.;wk*=blackAmount*2.;wo*=orangeAmount*2.;
 float total=max(.0001,wg+wb+wk+wo);
 vec3 color=(gray*wg+blue*wb+black*wk+orange*wo)/total;
 // Highlight selected orange boundaries only.
 float orangeCoverage=wo/total;
 float selected=smoothstep(-.2,.65,sin(p.x*10.+p.y*7.+s));
 float highlight=4.*orangeCoverage*(1.-orangeCoverage)*selected*.48;
 vec3 peach=vec3(246.,174.,133.)/255.;
 color=mix(color,peach,highlight);
 float n=(hash(gl_FragCoord.xy)-.5)*grain*.16;
 color+=n;
 gl_FragColor=vec4(clamp(color,0.,1.),1.);
 }`;
