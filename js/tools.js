function getPath(path) {
    return __dirname + '/../' +path
}

/**
 * 根据指定的最小值，和最大值，生成一个随机整数  如参数为  0,100       可以取到0-100之间任意整数
 * @param {*} min
 * @param {*} max 能取到最大值
 */
function randomFrom(min,max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}



module.exports = {getPath,randomFrom};

