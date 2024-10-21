export const globalGetGlobal = s => s.global.get('global').toJS().Global;
export const globalGetData = s => s.global.get('globalData').toJS();
export const globalInit = s => s.global.get('globalInit');
export const globalLang = s => s.global.get('globalLang');
