window.onload = function init()
{
    var p = [0,1,0,0];
    var angle = 180;
    var axis = [0,0,1];

    angle *= Math.PI / 180;

    calcRotation(p,axis,angle);

};


function calcRotation(point, axis, angle){
    var rot = [];

    rot[0]=axis[0] * Math.sin(angle/2);
    rot[1]=axis[1] * Math.sin(angle/2);
    rot[2]=axis[2] * Math.sin(angle/2);
    rot[3]=Math.cos(angle/2)

    rot = normalize(rot);
    console.log(rot)
    var con = conjugate(rot);

    var res = quatMultiply2(quatMultiply2(rot, point),con);
    console.log(res)
}

function normalize(vec){
    var total = vec[0]*vec[0];
        total += vec[1]*vec[1];
        total += vec[2]*vec[2];
        total += vec[3]*vec[3];
    var factor = Math.sqrt(total);
    vec[0]/=factor;
    vec[1]/=factor;
    vec[2]/=factor;
    vec[3]/=factor;
    console.log(total);
    return vec;
}

function quatMultiply(a,b){
    var res = []
    var w=3,x=0,y=1,z=2;
    res[w] = ((b[w] * a[w]) - (b[x] * a[x]) - (b[y] * a[y]) - (b[z] * a[z]));
    res[x] = ((b[w] * a[x]) + (b[x] * a[w]) - (b[y] * a[z]) + (b[z] * a[y]));
    res[y] = ((b[w] * a[y]) + (b[x] * a[z]) + (b[y] * a[w]) - (b[z] * a[x]));
    res[z] = ((b[w] * a[z]) - (b[x] * a[y]) + (b[y] * a[x]) + (b[z] * a[w]));
    console.log(res);
    return res;
}

function quatMultiply2(a, b){
    var res = []
    var w=3,x=0,y=1,z=2;
    res[w] = ((a[w] * b[w]) - (a[x] * b[x]) - (a[y] * b[y]) - (a[z] * b[z]));
    res[x] = ((a[w] * b[x]) + (a[x] * b[w]) - (a[y] * b[z]) + (a[z] * b[y]));
    res[y] = ((a[w] * b[y]) + (a[x] * b[z]) + (a[y] * b[w]) - (a[z] * b[x]));
    res[z] = ((a[w] * b[z]) - (a[x] * b[y]) + (a[y] * b[x]) + (a[z] * b[w]));
    return res;
}

function conjugate(quat){
    var out = [];
    out[0]=-quat[0];
    out[1]=-quat[1];
    out[2]=-quat[2];
    out[3]= quat[3];
    return out;
}