import { Injectable } from '@angular/core';
import { IsActiveMatchOptions } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class FuseUtilsService {
    /**
     * Constructor
     */
    constructor() {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the equivalent "IsActiveMatchOptions" options for "exact = true".
     */
    get exactMatchOptions(): IsActiveMatchOptions {
        return {
            paths: 'exact',
            fragment: 'ignored',
            matrixParams: 'ignored',
            queryParams: 'exact',
        };
    }

    /**
     * Get the equivalent "IsActiveMatchOptions" options for "exact = false".
     */
    get subsetMatchOptions(): IsActiveMatchOptions {
        return {
            paths: 'subset',
            fragment: 'ignored',
            matrixParams: 'ignored',
            queryParams: 'subset',
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Generates a random id
     *
     * @param length
     */
    randomId(length: number = 10): string {
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let name = '';

        for (let i = 0; i < 10; i++) {
            name += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return name;
    }

    humanizeCamelCase(text: string): string {
        return text
            .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase
            .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // Handle consecutive uppercase letters
            .replace(/\s+/g, ' ') // Remove extra spaces
            .trim() // Remove leading/trailing spaces
            .replace(/^./, (char) => char.toUpperCase()); // Capitalize the first letter
    }

    isLink(value: string): boolean {
        const urlPattern = /^(https?:\/\/[^\s]+)$/;
        return urlPattern.test(value);
    }

    isDownloadableLink(value: string): boolean {
        const urlPattern = /^(https?:\/\/[^\s]+)$/;
        const fileExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg|mp4|mov|avi|mkv|webm|mp3|wav|flac|aac|pdf|docx?|xlsx?|pptx?|zip|rar|7z|tar|gz|exe|dmg|iso)$/i;
    
        return urlPattern.test(value) && fileExtensions.test(value);
    }
    

    isNested(value: any): boolean {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            return true; // If it's an object, return true
        } else {
            return Array.isArray(value) && value.length > 0 &&
                   value.every(item => typeof item === 'object' && item !== null && !Array.isArray(item));
        }
    }

    parseNestedData(value: any): any {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            return [value];
        }
        
        return value;
    }
}
