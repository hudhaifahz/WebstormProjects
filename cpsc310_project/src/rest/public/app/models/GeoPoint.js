"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Jnani on 3/20/17.
 */
class GeoPoint {
    /**
     * Constructor
     *
     * @param   {Number}    lat         Latitude
     * @param   {Number}    long        Longitude
     * @param   {Boolean}   inRadians   true if latitude and longitude are in radians
     */
    constructor(lat, lon, inRadians) {
        this.DEG2RAD = Math.PI / 180; // degrees to radian conversion
        this.RAD2DEG = 180 / Math.PI; // radians to degrees conversion
        this.MI2KM = 1.6093439999999999; // miles to kilometers conversion
        this.KM2MI = 0.621371192237334; // kilometers to miles conversion
        this.EARTH_RADIUS_KM = 6371.01; // Earth's radius in km
        this.EARTH_RADIUS_MI = 3958.762079; // Earth's radius in miles
        this.MAX_LAT = Math.PI / 2; // 90 degrees
        this.MIN_LAT = -this.MAX_LAT; // -90 degrees
        this.MAX_LON = Math.PI; // 180 degrees
        this.MIN_LON = -this.MAX_LON; // -180 degrees
        this.FULL_CIRCLE_RAD = Math.PI * 2; // Full cirle (360 degrees) in radians
        if (inRadians === true) {
            this.degLat = this.radiansToDegrees(lat);
            this.degLon = this.radiansToDegrees(lon);
            this.radLat = lat;
            this.radLon = lon;
        }
        else {
            this.degLat = lat;
            this.degLon = lon;
            this.radLat = this.degreesToRadians(lat);
            this.radLon = this.degreesToRadians(lon);
        }
        if (this.radLat < this.MIN_LAT || this.radLat > this.MAX_LAT) {
            throw new Error('Latitude out of bounds');
        }
        else if (this.radLon < this.MIN_LON || this.radLon > this.MAX_LON) {
            throw new Error('Longitude out of bounds');
        }
    }
    /**
     * Return the latitude
     *
     * @param   {Boolean}   inRadians   true to return the latitude in radians
     * @param   {Number}    latitude
     */
    latitude(inRadians) {
        if (inRadians) {
            return this.radLat;
        }
        return this.degLat;
    }
    ;
    /**
     * Return the longitude
     *
     * @param   {Boolean}   inRadians   true to return the longitude in radians
     * @param   {Number}    longitude
     */
    longitude(inRadians) {
        if (inRadians) {
            return this.radLon;
        }
        return this.degLon;
    }
    ;
    /**
     * Calculates the distance between two points
     *
     * @param   {Object}    point         GeoPoint instance
     * @param   {Boolean}   inKilometers  true to return the distance in kilometers
     * @return  {Number}    distance between points
     */
    distanceTo(point, inKilometers) {
        var radius = inKilometers ? this.EARTH_RADIUS_KM : this.EARTH_RADIUS_MI, lat1 = this.latitude(true), lat2 = point.latitude(true), lon1 = this.longitude(true), lon2 = point.longitude(true);
        return Math.acos(Math.sin(lat1) * Math.sin(lat2) +
            Math.cos(lat1) * Math.cos(lat2) *
                Math.cos(lon1 - lon2)) * radius;
    }
    ;
    /**
     * Calculate the bouding coordinates
     *
     * @param   {Number}    distance      distance from the point
     * @param   {Number}    radius        optional sphere radius to use
     * @param   {Boolean}   inKilometers  true to return the distance in kilometers
     * @return  {Array}     array containing SW and NE points of bounding box
     */
    boundingCoordinates(distance, radius, inKilometers) {
        if (distance <= 0) {
            throw new Error('Invalid distance');
        }
        // if (radius === true || radius === false) {
        //     inKilometers = radius;
        //     radius = null;
        // }
        if (radius <= 0) {
            radius = inKilometers === true ? this.EARTH_RADIUS_KM : this.EARTH_RADIUS_MI;
        }
        var lat = this.latitude(true), lon = this.longitude(true), radDist = distance / radius, minLat = lat - radDist, maxLat = lat + radDist, minLon, maxLon, deltaLon;
        if (minLat > this.MIN_LAT && maxLat < this.MAX_LAT) {
            deltaLon = Math.asin(Math.sin(radDist) / Math.cos(lat));
            minLon = lon - deltaLon;
            if (minLon < this.MIN_LON) {
                minLon += this.FULL_CIRCLE_RAD;
            }
            maxLon = lon + deltaLon;
            if (maxLon > this.MAX_LON) {
                maxLon -= this.FULL_CIRCLE_RAD;
            }
        }
        else {
            minLat = Math.max(minLat, this.MIN_LAT);
            maxLat = Math.min(maxLat, this.MAX_LAT);
            minLon = this.MIN_LON;
            maxLon = this.MAX_LON;
        }
        return [new GeoPoint(minLat, minLon, true), new GeoPoint(maxLat, maxLon, true)];
    }
    ;
    /**
     * Convert degrees to radians
     *
     * @param   {Number}    value   degree value
     * @return  {Number}    radian value
     */
    degreesToRadians(value) {
        return value * this.DEG2RAD;
    }
    ;
    /**
     * Convert radians to degrees
     *
     * @param   {Number}    value   radian value
     * @return  {Number}    degree value
     */
    radiansToDegrees(value) {
        return value * this.RAD2DEG;
    }
    ;
    /**
     * Cnvert miles to kilometers
     *
     * @param   {Number}    value   miles value
     * @return  {Number}    kilometers value
     */
    milesToKilometers(value) {
        return value * this.MI2KM;
    }
    ;
    /**
     * Convert kilometers to miles
     *
     * @param   {Number}    value   kilometer value
     * @return  {Number}    miles value
     */
    kilometersToMiles(value) {
        return value * this.KM2MI;
    }
    ;
}
exports.GeoPoint = GeoPoint;
//# sourceMappingURL=GeoPoint.js.map