export function isDisabled(): any {
    
    if (
        localStorage.getItem('userPermission') === 'gipiAdmin'
    ) {
        return false;
    } else {
        return true;
    }
}