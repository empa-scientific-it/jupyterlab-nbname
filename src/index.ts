import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { INotebookTracker } from '@jupyterlab/notebook';

/**
 * Initialization data for the nbname extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'nbname:plugin',
  description:
    'A JupyterLab extension to retrieve the currently openend notebook filename.',
  autoStart: true,
  requires: [INotebookTracker],
  activate: (app: JupyterFrontEnd, tracker: INotebookTracker) => {
    // Function to inject the notebook name
    const injectNotebookName = (notebookPanel: any) => {
      if (!notebookPanel) {
        return;
      }
      const fullPath = notebookPanel.context.path;
      const filename = fullPath.split('/').pop();
      console.log(`Current notebook filename: ${filename}`);

      // Get Kernel
      const sessionContext = notebookPanel.sessionContext;
      if (!sessionContext?.session?.kernel) {
        console.warn('No kernel available!');
        return;
      }

      const kernel = sessionContext.session.kernel;

      // Inject the filename
      const code = `__NOTEBOOK_FILE__ = "${filename}"`;
      const future = kernel.requestExecute({ code, silent: true });
      future.done
        .then(() => {
          console.log(
            `Successfully injected __NOTEBOOK_FILE__ = "${filename}"`
          );
        })
        .catch((error: Error) => {
          console.error('Failed to inject code:', error);
        });
    };

    // Inject notebook name
    tracker.currentChanged.connect((tracker, notebookPanel) => {
      if (notebookPanel) {
        notebookPanel.sessionContext.ready.then(() => {
          injectNotebookName(notebookPanel);
        });

        notebookPanel.context.pathChanged.connect(() => {
          injectNotebookName(notebookPanel);
        });
      }
    });

    // Inject filename for currently opened notebook
    if (tracker.currentWidget) {
      tracker.currentWidget.sessionContext.ready.then(() => {
        injectNotebookName(tracker.currentWidget);
      });
    }

    console.log('Notebook filename injection is now active');
  }
};

export default plugin;
