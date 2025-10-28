import { useEffect, useState } from 'react';
import nProgress from 'nprogress';

const useLoader = (
	isDefaultLoading = false,
	withTopBar = true
): [status: boolean, setStatus: (state: boolean) => void] => {
	const [isLoading, setLoading] = useState<boolean>(isDefaultLoading);

	useEffect(() => {
		if (withTopBar) {
			isLoading ? nProgress.start() : nProgress.done();
		}
		return () => {
			nProgress.done();
		};
	}, [isLoading]);

	const setLoader = (state: boolean) => {
		setLoading(state);
	};

	return [isLoading, setLoader];
};

export default useLoader;
