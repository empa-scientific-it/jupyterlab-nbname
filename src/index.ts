import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the nbname extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'nbname:plugin',
  description: 'A JupyterLab extension to retrieve the currently openend notebook filename.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension nbname is activated!');
  }
};

export default plugin;
